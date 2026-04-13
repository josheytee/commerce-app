import { Body, Controller, Param, Patch } from '@nestjs/common';
import { RiderService } from '../services';

@Controller('riders')
export class RiderController {
    constructor(private _riderService: RiderService) { }

    @Patch(':id/location')
    updateLocation(
        @Param('id') id: number,
        @Body() body: { lat: number; lng: number },
    ) {
        return this._riderService.updateLocation(id, body.lat, body.lng);
    }
}
