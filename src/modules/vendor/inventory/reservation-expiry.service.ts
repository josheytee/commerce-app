// src/modules/inventory/reservation-expiry.service.ts
import { Injectable, Logger } from '@nestjs/common';
// import { Cron, CronExpression } from '@nestjs/schedule';
import { InventoryReservationService } from './inventory-reservation.service';

@Injectable()
export class ReservationExpiryService {
    private readonly logger = new Logger(ReservationExpiryService.name);
    private running = false;

    constructor(private readonly reservations: InventoryReservationService) { }

    // @Cron(CronExpression.EVERY_5_MINUTES)
    async expire(): Promise<void> {
        if (this.running) return; // prevent overlap
        this.running = true;
        try {
            await this.reservations.expireStaleReservations();
        } catch (err) {
            this.logger.error(
                `Failed to expire stale reservations: ${(err as Error).message}`,
                (err as Error).stack,
            );
        } finally {
            this.running = false;
        }
    }
}
