import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import {
  CartModel,
  CartItemModel,
  ProductModel,
  ProductVariantModel,
  InventoryModel,
} from 'src/infrastructure';
import {
  CartItemRepository,
  CartRepository,
  ProductRepository,
  VariantRepository,
  InventoryRepository,
} from 'src/infrastructure/database/repositories';
import { InventoryModule, OrderModule } from 'src/modules/vendor';

@Module({
  imports: [
    SequelizeModule.forFeature([
      CartModel,
      CartItemModel,
      ProductModel,
      ProductVariantModel,
      InventoryModel,
    ]),
    InventoryModule,
    forwardRef(() => OrderModule),
  ],
  providers: [
    CartService,
    CartRepository,
    CartItemRepository,
    ProductRepository,
    VariantRepository,
    InventoryRepository,
  ],
  controllers: [CartController],
  exports: [CartService, CartRepository, CartItemRepository],
})
export class CartModule { }
