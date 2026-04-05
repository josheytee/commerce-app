import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DeliveryTrackingModel } from 'src/infrastructure';

@Injectable()
export class TrackingService {
    constructor(
        @InjectModel(DeliveryTrackingModel)
        private trackingModel: typeof DeliveryTrackingModel,
    ) { }

    async updateLocation(fulfillmentId: number, lat: number, lng: number) {
        return this.trackingModel.create({
            fulfillment_id: fulfillmentId,
            lat,
            lng,
            timestamp: new Date(),
        });
    }
}
