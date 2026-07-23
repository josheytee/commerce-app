// services/cart.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Transaction } from 'sequelize';
import { AddToCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CartModel, CartItemModel } from 'src/infrastructure';
import {
  CartItemRepository,
  CartRepository,
  ProductRepository,
  VariantRepository,
  InventoryRepository,
} from 'src/infrastructure/database/repositories';
import { ProductStatusEnum, VariantStockStatusEnum } from 'src/shared/enums';
import {
  ProductNotFoundException,
  ProductVariantNotFoundException,
  CartItemNotFoundException,
  CartNotFoundException,
} from 'src/shared';

@Injectable()
export class CartService {
  private CART_TTL = 30 * 60 * 1000; // 30 mins

  constructor(
    private readonly _cartRepository: CartRepository,
    private readonly _cartItemRepository: CartItemRepository,
    private readonly _productRepository: ProductRepository,
    private readonly _productVariantRepository: VariantRepository,
    private readonly _inventoryRepository: InventoryRepository,
    // private readonly _inventoryService: InventoryService,
  ) { }

  // ============ ADD TO CART ============
  /**
   * Add product to cart (handles both simple products and variants)
   */
  async addToCart(
    userId: number,
    dto: AddToCartDto,
    transaction?: Transaction,
  ) {
    // Get or create cart
    const cart = await this.getOrCreateCart(userId, transaction);

    // ✅ ALWAYS use variant_id - no special cases needed
    if (!dto.product_variant_id) {
      throw new BadRequestException('Product variant ID is required');
    }

    // Validate variant exists and is active
    const variant = await this._productVariantRepository.findById(
      dto.product_variant_id,
      // transaction,
    );

    if (!variant) {
      throw new ProductVariantNotFoundException(dto.product_variant_id);
    }

    // Check if product is active
    const product = await this._productRepository.findById(
      variant.product_id,
      // transaction,
    );
    if (
      !product ||
      product.status !== ProductStatusEnum.PUBLISHED ||
      !product.is_active
    ) {
      throw new BadRequestException('Product is not available');
    }

    // Validate inventory
    await this.validateInventory(
      dto.product_variant_id,
      dto.quantity,
      transaction,
    );

    // Add to cart
    const existing = await this._cartItemRepository.findByVariant(
      cart.id,
      dto.product_variant_id,
      // transaction,
    );

    if (existing) {
      existing.quantity += dto.quantity;
      await existing.save({ transaction });
    } else {
      await this._cartItemRepository.createWithTransaction(
        {
          cart_id: cart.id,
          product_id: variant.product_id,
          product_variant_id: dto.product_variant_id,
          quantity: dto.quantity,
          store_id: dto.store_id || product.store_id,
        },
        transaction,
      );
    }

    await this.refreshCartExpiry(cart.id, transaction);
    return this.getCart(userId);
  }

  // ============ GET OR CREATE CART ============
  async getOrCreateCart(customerId: number, transaction?: Transaction) {
    let cart = await this._cartRepository.findActiveCart(
      customerId,
      // transaction,
    );

    if (!cart) {
      cart = await this._cartRepository.createWithTransaction(
        {
          customer_id: customerId,
          // expires_at: this.getExpiry(),
        },
        transaction,
      );
    }

    return cart;
  }

  // ============ GET CART ============
  async getCart(userId: number) {
    return this._cartRepository.findActiveCart(userId);
  }

  // ============ UPDATE ITEM QUANTITY ============
  async updateItem(
    itemId: number,
    quantity: number,
    transaction?: Transaction,
  ) {
    if (quantity < 0) {
      throw new BadRequestException('Quantity cannot be negative');
    }

    if (quantity === 0) {
      return this.removeItem(itemId, transaction);
    }

    const item = await this._cartItemRepository.findById(itemId);
    if (!item) {
      throw new CartItemNotFoundException(itemId);
    }

    // Get variant and check inventory
    const variant = await this._productVariantRepository.findById(
      item.product_variant_id,
    );
    if (!variant) {
      throw new ProductVariantNotFoundException(item.product_variant_id);
    }

    // Check if requested quantity is available
    const diff = quantity - item.quantity;
    if (diff > 0) {
      await this.validateInventory(variant.id, diff, transaction);
    }

    // Update quantity
    item.quantity = quantity;
    await item.save({ transaction });

    // Refresh cart expiry
    await this.refreshCartExpiry(item.cart_id, transaction);

    return item;
  }

  // ============ REMOVE ITEM ============
  async removeItem(itemId: number, transaction?: Transaction) {
    const item = await this._cartItemRepository.findById(itemId);
    if (!item) {
      throw new CartItemNotFoundException(itemId);
    }

    // Release inventory reservation if needed
    // await this._inventoryService.release(
    //   item.product_variant_id,
    //   item.store_id,
    //   item.quantity,
    // );

    await item.destroy({ transaction });

    // Refresh cart expiry
    await this.refreshCartExpiry(item.cart_id, transaction);

    return { success: true, message: 'Item removed from cart' };
  }

  // ============ CLEAR CART ============
  async clearCart(cartId: number, transaction?: Transaction) {
    const cart = await this._cartRepository.findById(cartId);
    if (!cart) {
      throw new CartNotFoundException(cartId);
    }

    // Get all items to release inventory
    // const items = await this._cartItemRepository.findAll({
    //   where: { cart_id: cartId },
    //   transaction,
    // });

    // for (const item of items) {
    //   await this._inventoryService.release(
    //     item.product_variant_id,
    //     item.store_id,
    //     item.quantity,
    //   );
    // }

    // Delete all items
    await this._cartItemRepository.deleteById(cartId);

    // Reset expiry
    await this.refreshCartExpiry(cartId, transaction);

    return { success: true, message: 'Cart cleared' };
  }

  // ============ FIND ALL ============
  async findAll(): Promise<CartModel[]> {
    return this._cartRepository.findAll({ include: ['customer'] });
  }

  // ============ FIND ONE ============
  async findOne(id: number): Promise<CartModel> {
    const cart = await this._cartRepository.findById(id);
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    return cart;
  }

  // ============ UPDATE CART ============
  async update(
    id: number,
    updateCartDto: UpdateCartDto,
    transaction?: Transaction,
  ): Promise<CartModel> {
    const cart = await this.findOne(id);
    return cart.update(updateCartDto, { transaction });
  }

  // ============ REMOVE CART ============
  async remove(id: number, transaction?: Transaction): Promise<void> {
    const cart = await this.findOne(id);
    await cart.destroy({ transaction });
  }

  // ============ VALIDATE INVENTORY ============
  private async validateInventory(
    variantId: number,
    quantity: number,
    transaction?: Transaction,
  ) {
    const inventory = await this._inventoryRepository.findByVariantId(
      variantId,
      transaction,
    );

    if (!inventory) {
      throw new NotFoundException(
        `Inventory not found for variant ${variantId}`,
      );
    }

    const available = inventory.stock_quantity - inventory.reserved_quantity;

    if (available < quantity) {
      throw new ConflictException(
        `Insufficient stock. Available: ${available}, Requested: ${quantity}`,
      );
    }

    return inventory;
  }

  // ============ VALIDATE STORE ============
  private async validateStore(storeId: number, transaction?: Transaction) {
    // Check if store exists and is active
    // This would be implemented based on your Store model
    // const store = await this._storeRepository.findById(storeId, transaction);
    // if (!store || !store.is_active) {
    //   throw new NotFoundException(`Store ${storeId} not found or inactive`);
    // }
    return true;
  }

  // ============ ADD ITEM TO CART ============
  private async addItemToCart(
    cartId: number,
    data: {
      product_id: number;
      product_variant_id: number;
      quantity: number;
      store_id?: number;
    },
    transaction?: Transaction,
  ): Promise<CartItemModel> {
    // Check if item already exists in cart
    const existing = await this._cartItemRepository.findByVariant(
      cartId,
      data.product_variant_id,
      // transaction,
    );

    if (existing) {
      // Validate total quantity
      const newQuantity = existing.quantity + data.quantity;
      await this.validateInventory(
        data.product_variant_id,
        newQuantity,
        transaction,
      );

      // Update existing item
      existing.quantity = newQuantity;
      await existing.save({ transaction });
      return existing;
    }

    // Create new cart item
    return this._cartItemRepository.createWithTransaction(
      {
        cart_id: cartId,
        product_id: data.product_id,
        product_variant_id: data.product_variant_id,
        quantity: data.quantity,
        store_id: data.store_id || null,
      },
      transaction,
    );
  }

  // ============ REFRESH CART EXPIRY ============
  private async refreshCartExpiry(cartId: number, transaction?: Transaction) {
    await this._cartRepository.updateWithTransaction(
      cartId,
      {
        // expires_at: this.getExpiry(),
        // updated_at: new Date(),
      },
      transaction,
    );
  }

  // ============ GET EXPIRY ============
  private getExpiry() {
    return new Date(Date.now() + this.CART_TTL);
  }
}
