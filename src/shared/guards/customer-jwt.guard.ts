// src/shared/guards/customer-jwt.guard.ts
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class CustomerJwtGuard implements CanActivate {
    canActivate(ctx: ExecutionContext): boolean {
        const req = ctx.switchToHttp().getRequest();
        console.log('user', req, req.user);
        if (!req.user?.customer?.id) {
            throw new UnauthorizedException('Customer authentication required');
        }
        return true;
    }
}
