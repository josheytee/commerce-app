import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './models/cart.model';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart)
    private cartModel: typeof Cart,
  ) {}

  async create(createCartDto: CreateCartDto): Promise<Cart> {
    return this.cartModel.create(createCartDto);
  }

  async findAll(): Promise<Cart[]> {
    return this.cartModel.findAll({ include: ['customer'] });
  }

  async findOne(id: string): Promise<Cart> {
    const cart = await this.cartModel.findByPk(id, { include: ['customer'] });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    return cart;
  }

  async update(id: string, updateCartDto: UpdateCartDto): Promise<Cart> {
    const cart = await this.findOne(id);
    return cart.update(updateCartDto);
  }

  async remove(id: string): Promise<void> {
    const cart = await this.findOne(id);
    await cart.destroy();
  }
}
