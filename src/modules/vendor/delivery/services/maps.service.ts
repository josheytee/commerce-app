import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import axios from 'axios';
import { Sequelize } from 'sequelize-typescript';
import { InventoryModel } from 'src/infrastructure';
import {
    OrderRepository,
    VariantRepository,
    InventoryRepository,
} from 'src/infrastructure/database/repositories';
import { StockStatusEnum } from 'src/shared';

@Injectable()
export class MapsService {
    constructor(
        private readonly _inventoryRepository: InventoryRepository,
        private readonly _orderRepository: OrderRepository,
        private readonly _variantRepository: VariantRepository,
        private readonly _sequelize: Sequelize,
    ) { }

    async getDistance(origin, destination) {
        const res = await axios.get(
            `https://maps.googleapis.com/maps/api/distancematrix/json`,
            {
                params: {
                    origins: `${origin.lat},${origin.lng}`,
                    destinations: `${destination.lat},${destination.lng}`,
                    key: process.env.GOOGLE_MAPS_API_KEY,
                },
            },
        );

        const element = res.data.rows[0].elements[0];

        return {
            distance_km: element.distance.value / 1000,
            duration_min: element.duration.value / 60,
        };
    }
}
