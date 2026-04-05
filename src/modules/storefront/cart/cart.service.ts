import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CartModel } from 'src/infrastructure';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(CartModel)
    private cartModel: typeof CartModel,
  ) { }

  //   - addToCart()
  // - removeItem()
  // - clearExpired()

  async create(createCartDto: CreateCartDto): Promise<CartModel> {
    return this.cartModel.create(createCartDto);
  }

  async findAll(): Promise<CartModel[]> {
    return this.cartModel.findAll({ include: ['customer'] });
  }

  async findOne(id: string): Promise<CartModel> {
    const cart = await this.cartModel.findByPk(id, { include: ['customer'] });
    if (!cart) {
      throw new NotFoundException('CartModel not found');
    }
    return cart;
  }

  async update(id: string, updateCartDto: UpdateCartDto): Promise<CartModel> {
    const cart = await this.findOne(id);
    return cart.update(updateCartDto);
  }

  async remove(id: string): Promise<void> {
    const cart = await this.findOne(id);
    await cart.destroy();
  }
}
