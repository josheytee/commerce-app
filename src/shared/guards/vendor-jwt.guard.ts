// src/shared/guards/vendor-jwt.guard.ts
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class VendorJwtGuard implements CanActivate {
    canActivate(ctx: ExecutionContext): boolean {
        const req = ctx.switchToHttp().getRequest();
        // A user can own multiple vendors. The guard only ensures the user is
        // authenticated. Ownership of the specific :vendorId is verified inside
        // the controller via assertUserOwnsVendor(...).
        if (!req.user?.id) {
            throw new UnauthorizedException('Vendor authentication required');
        }
        return true;
    }
}
