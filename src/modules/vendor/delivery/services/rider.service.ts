import { Injectable } from '@nestjs/common';
import { RiderRepository } from 'src/infrastructure/database/repositories';

@Injectable()
export class RiderService {
    constructor(private _riderRepository: RiderRepository) { }

    async updateLocation(id: number, lat: number, lng: number) {
        return this._riderRepository.update(id, {
            current_lat: lat,
            current_lng: lng,
        });
    }

    async getAvailableRiders() {
        return this._riderRepository.findAvailable();
    }
}
