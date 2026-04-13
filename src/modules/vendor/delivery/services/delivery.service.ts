import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { InventoryModel } from 'src/infrastructure';
import {
  OrderRepository,
  VariantRepository,
  InventoryRepository,
} from 'src/infrastructure/database/repositories';
import { StockStatusEnum } from 'src/shared';

@Injectable()
export class DeliveryService {
  constructor(
    private readonly _inventoryRepository: InventoryRepository,
    private readonly _orderRepository: OrderRepository,
    private readonly _variantRepository: VariantRepository,
    private readonly _sequelize: Sequelize,
  ) { }

  //   DeliveryService
  // - calculateDistance()
  // - findBestStore()
  // - computeFee()

  // async findBestStore(variantId: number, userAddressId: number) {
  //   const userAddress = await this.addressRepo.findByPk(userAddressId);

  //   const inventories = await this.inventoryRepo.findAll({
  //     where: { product_variant_id: variantId },
  //     include: ['store'],
  //   });

  //   let best = null;

  //   for (const inv of inventories) {
  //     const storeAddress = inv.store.address;

  //     const distance = this.calculateDistance(
  //       userAddress.latitude,
  //       userAddress.longitude,
  //       storeAddress.latitude,
  //       storeAddress.longitude,
  //     );

  //     if (distance > inv.store.delivery_config.max_radius_km) continue;

  //     const deliveryFee =
  //       inv.store.delivery_config.base_fee +
  //       distance * inv.store.delivery_config.per_km;

  //     if (!best || deliveryFee < best.deliveryFee) {
  //       best = {
  //         store_id: inv.store.id,
  //         deliveryFee,
  //         distance,
  //       };
  //     }
  //   }

  //   return best;
  // }

  // async getDistance(origin, destination) {
  //   const res = await axios.get(
  //     `https://maps.googleapis.com/maps/api/distancematrix/json`,
  //     {
  //       params: {
  //         origins: `${origin.lat},${origin.lng}`,
  //         destinations: `${destination.lat},${destination.lng}`,
  //         key: process.env.GOOGLE_MAPS_API_KEY,
  //       },
  //     },
  //   );

  //   const element = res.data.rows[0].elements[0];

  //   return {
  //     distance_km: element.distance.value / 1000,
  //     duration_min: element.duration.value / 60,
  //   };
  // }
}
