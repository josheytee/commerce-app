import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartModel, CartItemModel } from 'src/infrastructure';
import {
  CartItemRepository,
  CartRepository,
} from 'src/infrastructure/database/repositories';
import { InventoryModule, OrderModule } from 'src/modules/vendor';

@Module({
  imports: [
    SequelizeModule.forFeature([CartModel, CartItemModel]),
    InventoryModule,
    forwardRef(() => OrderModule),
  ],
  providers: [CartService, CartRepository, CartItemRepository],
  controllers: [CartController],
  exports: [CartService, CartRepository, CartItemRepository],
})
export class CartModule { }
