import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FulfillmentService } from './fulfillment.service';
@Module({
    imports: [SequelizeModule.forFeature([])],
    providers: [FulfillmentService],
    controllers: [],
    exports: [FulfillmentService],
})
export class FulfillmentModule { }
