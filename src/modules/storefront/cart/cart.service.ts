import { Injectable, NotFoundException } from '@nestjs/common';
import { AddToCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CartModel } from 'src/infrastructure';
import {
  CartItemRepository,
  CartRepository,
} from 'src/infrastructure/database/repositories';
// import { InventoryService } from 'src/modules/vendor/inventory/inventory.service';

@Injectable()
export class CartService {
  private CART_TTL = 30 * 60 * 1000; // 30 mins

  constructor(
    private readonly _cartRepository: CartRepository,
    private readonly _cartItemRepository: CartItemRepository,
    // private readonly _inventoryService: InventoryService,
  ) { }

  //   - addToCart()
  // - removeItem()
  // - clearExpired()

  // async create(createCartDto: CreateCartDto): Promise<CartModel> {
  //   return this.cartModel.create(createCartDto);
  // }

  // ➕ add to cart
  async addToCart(userId: number, dto: AddToCartDto) {
    const cart = await this.getOrCreateCart(userId);

    // 🔥 reserve stock
    // await this._inventoryService.reserve(
    //   dto.product_variant_id,
    //   dto.store_id,
    //   dto.quantity,
    // );

    const existing = await this._cartItemRepository.findByVariant(
      cart.id,
      dto.product_variant_id,
    );

    if (existing) {
      existing.quantity += dto.quantity;
      await existing.save();
    } else {
      await this._cartItemRepository.create({
        cart_id: cart.id,
        ...dto,
      });
    }

    // await this.refreshExpiry(cart);

    return this.getCart(userId);
  }

  // 🧠 get or create cart
  async getOrCreateCart(customerId: number) {
    let cart = await this._cartRepository.findActiveCart(customerId);

    if (!cart) {
      cart = await this._cartRepository.create({
        customer_id: customerId,
        // expires_at: this.getExpiry(),
      });
    }

    return cart;
  }

  async findAll(): Promise<CartModel[]> {
    return this._cartRepository.findAll({ include: ['customer'] });
  }

  async findOne(id: number): Promise<CartModel> {
    const cart = await this._cartRepository.findById(id);
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    return cart;
  }

  async update(id: number, updateCartDto: UpdateCartDto): Promise<CartModel> {
    const cart = await this.findOne(id);
    return cart.update(updateCartDto);
  }

  async remove(id: number): Promise<void> {
    const cart = await this.findOne(id);
    await cart.destroy();
  }

  // 🔄 update quantity
  async updateItem(itemId: number, quantity: number) {
    const item = await this._cartItemRepository.findById(itemId);

    // const diff = quantity - item.quantity;

    // if (diff > 0) {
    //   await this._inventoryService.reserve(
    //     item.product_variant_id,
    //     item.store_id,
    //     diff,
    //   );
    // } else if (diff < 0) {
    //   await this._inventoryService.release(
    //     item.product_variant_id,
    //     item.store_id,
    //     Math.abs(diff),
    //   );
    // }

    item.quantity = quantity;
    await item.save();

    return item;
  }

  // ❌ remove item
  async removeItem(itemId: number) {
    const item = await this._cartItemRepository.findById(itemId);

    // await this._inventoryService.release(
    //   item.product_variant_id,
    //   item.store_id,
    //   item.quantity,
    // );

    await item.destroy();

    return true;
  }

  // 🧾 get cart
  async getCart(userId: number) {
    return this._cartRepository.findActiveCart(userId);
  }

  // 🧹 clear cart
  async clearCart(cartId: number) {
    // const items = await this._cartItemRepository.findAll({
    //   where: { cart_id: cartId },
    // });

    // for (const item of items) {
    //   await this._inventoryService.release(
    //     item.product_variant_id,
    //     item.store_id,
    //     item.quantity,
    //   );
    // }

    await this._cartItemRepository.delete({ where: { cart_id: cartId } });
  }

  // ⏳ helpers
  private getExpiry() {
    return new Date(Date.now() + this.CART_TTL);
  }

  // private async refreshExpiry(cart: CartModel) {
  //   cart.expires_at = this.getExpiry();
  //   await cart.save();
  // }
}
