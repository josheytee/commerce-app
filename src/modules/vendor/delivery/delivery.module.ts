import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DeliveryService } from './services/delivery.service';
import {
  DeliveryTrackingModel,
  FulfillmentModel,
  InventoryModel,
  OrderModel,
  ProductVariantModel,
  RiderModel,
} from 'src/infrastructure';
import {
  FulfillmentRepository,
  InventoryRepository,
  OrderRepository,
  RiderRepository,
  VariantRepository,
} from 'src/infrastructure/database/repositories';
import { DeliveryBatchModel } from 'src/infrastructure/database/models/delivery-batches.model';
import { MapsService, RiderAssignmentService, RiderService } from './services';
import { TrackingService } from '../tracking/tracking.service';
import { DeliveryController, RiderController } from './controllers';
import { BatchService } from './services/batch.service';
import { FulfillmentService } from './services/fulfillment.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      InventoryModel,
      OrderModel,
      ProductVariantModel,
      RiderModel,
      FulfillmentModel,
      DeliveryTrackingModel,
      DeliveryBatchModel,
    ]),
  ],
  providers: [
    DeliveryService,
    InventoryRepository,
    OrderRepository,
    VariantRepository,
    RiderService,
    FulfillmentRepository,
    FulfillmentService,
    RiderAssignmentService,
    TrackingService,
    BatchService,
    RiderRepository,
    MapsService,
  ],
  controllers: [
    DeliveryController,
    RiderController,
    // FulfillmentController,
  ],
  exports: [DeliveryService],
})
export class DeliveryModule { }
