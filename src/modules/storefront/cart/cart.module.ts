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
  InventoryReservationModel,
  AttributeModel,
} from 'src/infrastructure';
import {
  CartItemRepository,
  CartRepository,
  ProductRepository,
  VariantRepository,
  InventoryRepository,
  InventoryReservationRepository,
  AttributeRepository,
} from 'src/infrastructure/database/repositories';
import { InventoryModule, OrderModule } from 'src/modules/vendor';

@Module({
  imports: [
    SequelizeModule.forFeature([
      CartModel,
      CartItemModel,
      ProductModel,
      AttributeModel,
      InventoryModel,
      ProductVariantModel,
      InventoryReservationModel,
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
    InventoryReservationRepository,
    AttributeRepository,
  ],
  controllers: [CartController],
  exports: [CartService, CartRepository, CartItemRepository],
})
export class CartModule { }
