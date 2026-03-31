import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartModel, CartItemModel } from 'src/infrastructure';

@Module({
  imports: [SequelizeModule.forFeature([CartModel, CartItemModel])],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule { }
