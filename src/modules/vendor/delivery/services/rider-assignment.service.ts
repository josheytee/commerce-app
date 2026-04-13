import { Injectable } from '@nestjs/common';
import {
    FulfillmentRepository,
    RiderRepository,
} from 'src/infrastructure/database/repositories';
import { FulfillmentModel } from 'src/infrastructure';
import { FulfillmentStatusEnum } from 'src/shared';
import { MapsService } from './maps.service';

@Injectable()
export class RiderAssignmentService {
    constructor(
        private _riderRepository: RiderRepository,
        private _fulfillmentRepository: FulfillmentRepository,
        private _mapsService: MapsService,
    ) { }

    async assign(fulfillment: FulfillmentModel) {
        const riders = await this._riderRepository.findAvailable();

        let best = null;

        for (const rider of riders) {
            const distance = await this._mapsService.getDistance(
                { lat: rider.current_lat, lng: rider.current_lng },
                fulfillment.store.address,
            );

            if (!best || distance.distance_km < best.distance) {
                best = { rider, distance };
            }
        }

        await this._fulfillmentRepository.update(fulfillment.id, {
            rider_id: best.rider.id,
            status: FulfillmentStatusEnum.ASSIGNED,
        });

        return best.rider;
    }
}
