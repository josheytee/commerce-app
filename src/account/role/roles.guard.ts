import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { VendorService } from '../vendor/vendor.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private vendorService: VendorService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('No user found');
    }

    const vendor = await this.vendorService.findByUserId(user.id);
    if (!vendor) {
      throw new ForbiddenException('No vendor associated with this user');
    }

    const hasRole = requiredRoles.some((role) =>
      vendor.roles.some((vendorRole) => vendorRole.name === role),
    );
    if (!hasRole) {
      throw new ForbiddenException('You do not have the required role');
    }

    return true;
  }
}
