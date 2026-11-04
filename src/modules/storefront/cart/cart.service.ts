// src/modules/cart/cart.service.ts
import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';

import {
  CartModel,
  CartItemModel,
  InventoryReservationModel,
} from 'src/infrastructure';
import {
  CartRepository,
  CartItemRepository,
  ProductRepository,
  VariantRepository,
  InventoryReservationRepository,
} from 'src/infrastructure/database/repositories';
import {
  CartItemNotFoundException,
  CartNotFoundException,
  ProductNotFoundException,
  ProductStatusEnum,
  ProductVariantNotFoundException,
  InventoryReservationStatusEnum,
} from 'src/shared';
import { AddToCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InventoryService } from 'src/modules/vendor/inventory/inventory.service';

// ============================================================
// CART SERVICE
// ============================================================
// Invariants:
//   1. Every cart item that holds physical stock has a matching
//      InventoryReservationModel with status = HELD.
//   2. Cart service NEVER writes reserved_quantity directly — it
//      delegates to InventoryService so low-stock, backorder, and
//      stock_status logic stay in one place.
//   3. Every mutation runs in a transaction (either provided by the
//      caller or opened here).
// ============================================================

const CART_TTL_MS = 30 * 60 * 1000; // 30 minutes

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(
    private readonly cartRepo: CartRepository,
    private readonly cartItemRepo: CartItemRepository,
    private readonly productRepo: ProductRepository,
    private readonly variantRepo: VariantRepository,
    private readonly reservationRepo: InventoryReservationRepository,
    private readonly inventoryService: InventoryService,
    private readonly sequelize: Sequelize,
  ) { }

  // ============================================================
  // ADD TO CART
  // ============================================================

  /**
   * Add a variant to the customer's active cart.
   * - Validates the variant, product, and store.
   * - Reserves stock via InventoryService.
   * - Creates or updates the cart item.
   * - Creates an InventoryReservation tied to the cart item.
   *
   * All steps run in a single transaction.
   */
  async addToCart(
    customerId: number,
    dto: AddToCartDto,
    externalTransaction?: Transaction,
  ) {
    if (!dto.product_variant_id) {
      throw new BadRequestException('Product variant ID is required');
    }
    if (dto.quantity <= 0) {
      throw new BadRequestException('Quantity must be positive');
    }

    const run = async (t: Transaction) => {
      // 1. Load variant + product
      const variant = await this.variantRepo.findById(dto.product_variant_id, {
        transaction: t,
      });
      if (!variant) {
        throw new ProductVariantNotFoundException(dto.product_variant_id);
      }

      const product = await this.productRepo.findById(variant.product_id, {
        transaction: t,
      });
      if (
        !product ||
        product.status !== ProductStatusEnum.PUBLISHED ||
        !product.is_active
      ) {
        throw new BadRequestException('Product is not available');
      }

      // 2. Resolve store
      const storeId = dto.store_id ?? variant.store_id;
      if (!storeId) {
        throw new BadRequestException('Cannot determine store for this variant');
      }

      // 3. Get or create the active cart
      const cart = await this.getOrCreateCart(customerId, t);

      // 4. Existing cart item?
      const existing = await this.cartItemRepo.findByVariant(
        cart.id,
        dto.product_variant_id,
      );

      // 5. Reserve stock — ONCE, capturing the inventory row
      const inventoryRow = await this.inventoryService.reserve(
        dto.product_variant_id,
        storeId,
        dto.quantity,
        t,
      );

      // 6. Upsert cart item + reservation
      if (existing) {
        await existing.update(
          { quantity: existing.quantity + dto.quantity },
          { transaction: t },
        );

        const reservation = await this.reservationRepo.findOne({
          where: {
            cart_item_id: existing.id,
            status: InventoryReservationStatusEnum.HELD,
          },
          transaction: t,
        });

        if (reservation) {
          await reservation.update(
            {
              quantity: Number(reservation.quantity) + dto.quantity,
              expires_at: this.getExpiry(),
            },
            { transaction: t },
          );
        } else {
          // Existing item with no live reservation — recreate one.
          // The reserve above already accounted for this quantity.
          await this.createReservation(
            existing,
            dto.quantity,
            inventoryRow.id,
            t,
          );
        }
      } else {
        const cartItem = await this.cartItemRepo.createWithTransaction(
          {
            cart_id: cart.id,
            product_id: variant.product_id,
            variant_id: dto.product_variant_id,
            store_id: storeId,
            quantity: dto.quantity,
          },
          t,
        );

        await this.createReservation(
          cartItem,
          dto.quantity,
          inventoryRow.id,
          t,
        );
      }

      // 7. Refresh cart expiry
      await this.refreshCartExpiry(cart.id, t);
      return cart.id;
    };

    const cartId = externalTransaction
      ? await run(externalTransaction)
      : await this.sequelize.transaction(run);

    return this.getCart(customerId, { cartId });
  }

  // ============================================================
  // GET OR CREATE
  // ============================================================

  async getOrCreateCart(
    customerId: number,
    t?: Transaction,
  ): Promise<CartModel> {
    const existing = await this.cartRepo.findActiveCart(customerId);
    if (existing) return existing;

    return this.cartRepo.createWithTransaction(
      {
        customer_id: customerId,
        status: 'active',
      } as any,
      t,
    );
  }

  // ============================================================
  // GET CART
  // ============================================================

  async getCart(
    customerId: number,
    options: { cartId?: number; t?: Transaction } = {},
  ): Promise<CartModel | null> {
    const cartId = options.cartId;
    if (cartId) {
      return this.cartRepo.findById(cartId, {
        include: ['items'],
        transaction: options.t,
      } as any);
    }
    return this.cartRepo.findActiveCart(customerId);
  }

  // ============================================================
  // UPDATE ITEM QUANTITY
  // ============================================================

  async updateItem(
    customerId: number,
    itemId: number,
    quantity: number,
    externalTransaction?: Transaction,
  ) {
    if (quantity < 0) {
      throw new BadRequestException('Quantity cannot be negative');
    }

    const run = async (t: Transaction) => {
      const item = await this.loadOwnedItem(customerId, itemId, t);

      if (quantity === 0) {
        await this.releaseReservationForItem(item, t);
        await item.destroy({ transaction: t });
        await this.refreshCartExpiry(item.cart_id, t);
        return { removed: true, item: null };
      }

      const diff = quantity - item.quantity;

      if (diff > 0) {
        // Growing the line — reserve more stock
        const inventoryRow = await this.inventoryService.reserve(
          item.variant_id,
          item.store_id,
          diff,
          t,
        );

        const reservation = await this.reservationRepo.findOne({
          where: {
            cart_item_id: item.id,
            status: InventoryReservationStatusEnum.HELD,
          },
          transaction: t,
        });
        if (reservation) {
          await reservation.update(
            {
              quantity: Number(reservation.quantity) + diff,
              expires_at: this.getExpiry(),
            },
            { transaction: t },
          );
        } else {
          await this.createReservation(item, quantity, inventoryRow.id, t);
        }
      } else if (diff < 0) {
        // Shrinking — release the delta
        await this.inventoryService.release(
          item.variant_id,
          item.store_id,
          -diff,
          t,
        );

        const reservation = await this.reservationRepo.findOne({
          where: {
            cart_item_id: item.id,
            status: InventoryReservationStatusEnum.HELD,
          },
          transaction: t,
        });
        if (reservation) {
          await reservation.update(
            { quantity: Number(reservation.quantity) - -diff },
            { transaction: t },
          );
        }
      }

      await item.update({ quantity }, { transaction: t });
      await this.refreshCartExpiry(item.cart_id, t);

      return { removed: false, item };
    };

    return externalTransaction
      ? run(externalTransaction)
      : this.sequelize.transaction(run);
  }

  // ============================================================
  // REMOVE ITEM
  // ============================================================

  async removeItem(
    customerId: number,
    itemId: number,
    externalTransaction?: Transaction,
  ) {
    const run = async (t: Transaction) => {
      const item = await this.loadOwnedItem(customerId, itemId, t);

      await this.releaseReservationForItem(item, t);
      await item.destroy({ transaction: t });
      await this.refreshCartExpiry(item.cart_id, t);

      return { success: true, message: 'Item removed from cart' };
    };

    return externalTransaction
      ? run(externalTransaction)
      : this.sequelize.transaction(run);
  }

  // ============================================================
  // CLEAR CART
  // ============================================================

  async clearCart(customerId: number, externalTransaction?: Transaction) {
    const run = async (t: Transaction) => {
      const cart = await this.cartRepo.findActiveCart(customerId);
      if (!cart) throw new CartNotFoundException(customerId);

      const items = await this.cartItemRepo.findAll({
        where: { cart_id: cart.id },
        transaction: t,
      });

      for (const item of items) {
        await this.releaseReservationForItem(item, t);
      }

      await this.cartItemRepo.deleteById(cart.id);
      await this.refreshCartExpiry(cart.id, t);

      return { success: true, message: 'Cart cleared' };
    };

    return externalTransaction
      ? run(externalTransaction)
      : this.sequelize.transaction(run);
  }

  // ============================================================
  // SIMPLE CRUD (admin/internal)
  // ============================================================

  async findAll(): Promise<CartModel[]> {
    return this.cartRepo.findAll({ include: ['customer', 'items'] });
  }

  async findOne(id: number): Promise<CartModel> {
    const cart = await this.cartRepo.findById(id);
    if (!cart) throw new CartNotFoundException(id);
    return cart;
  }

  async update(
    id: number,
    dto: UpdateCartDto,
    transaction?: Transaction,
  ): Promise<CartModel> {
    const cart = await this.findOne(id);
    return cart.update(dto as any, { transaction });
  }

  async remove(id: number, transaction?: Transaction): Promise<void> {
    const cart = await this.findOne(id);
    await cart.destroy({ transaction });
  }

  // ============================================================
  // PRIVATE HELPERS
  // ============================================================

  /**
   * Load a cart item and verify it belongs to the given customer's active cart.
   * Returns 404 on mismatch to prevent enumeration.
   */
  private async loadOwnedItem(
    customerId: number,
    itemId: number,
    t: Transaction,
  ): Promise<CartItemModel> {
    const item = await this.cartItemRepo.findById(itemId, { transaction: t });
    if (!item) throw new CartItemNotFoundException(itemId);

    const cart = await this.cartRepo.findById(item.cart_id, {
      transaction: t,
    });
    if (!cart || cart.customer_id !== customerId) {
      throw new CartItemNotFoundException(itemId);
    }
    return item;
  }

  /**
   * Create an InventoryReservation for a cart item.
   */
  private async createReservation(
    item: CartItemModel,
    quantity: number,
    inventory_id: number,
    t: Transaction,
  ): Promise<InventoryReservationModel> {
    return this.reservationRepo.createWithTransaction(
      {
        variant_id: item.variant_id,
        store_id: item.store_id,
        cart_item_id: item.id,
        quantity,
        status: InventoryReservationStatusEnum.HELD,
        expires_at: this.getExpiry(),
        inventory_id: inventory_id,
      } as any,
      t,
    );
  }

  /**
   * Release the reservation for a cart item (idempotent).
   */
  private async releaseReservationForItem(
    item: CartItemModel,
    t: Transaction,
  ): Promise<void> {
    const reservation = await this.reservationRepo.findOne({
      where: {
        cart_item_id: item.id,
        status: InventoryReservationStatusEnum.HELD,
      },
      transaction: t,
    });
    if (!reservation) return;

    await this.inventoryService.release(
      reservation.variant_id,
      reservation.store_id,
      Number(reservation.quantity),
      t,
    );

    await reservation.update(
      { status: InventoryReservationStatusEnum.RELEASED },
      { transaction: t },
    );
  }

  /**
   * Refresh the cart's expiry timestamp. No-op if the cart model doesn't
   * have an `expires_at` field — the method exists so we don't scatter
   * commented-out code everywhere.
   */
  private async refreshCartExpiry(
    cartId: number,
    t?: Transaction,
  ): Promise<void> {
    // If CartModel has an `expires_at` column, uncomment:
    // await this.cartRepo.updateWithTransaction(
    //   cartId,
    //   { expires_at: this.getExpiry() } as any,
    //   t,
    // );
    void cartId;
    void t;
  }

  private getExpiry(): Date {
    return new Date(Date.now() + CART_TTL_MS);
  }

  // ============================================================
  // REPOSITORY ACCESS (for composed flows)
  // ============================================================

  getRepository(): CartRepository {
    return this.cartRepo;
  }
}
