import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { VendorService } from '../vendor/vendor.service';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);
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
      this.logger.warn('No roles specified for the route');
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const vendor = await this.vendorService.findByUserId(user.id);

    if (!user && !vendor) {
      this.logger.error('User or Vendor not found in the request');
      return false;
    }

    this.logger.log(`User/Vendor is trying to access ${request.url}`);

    if (!user) {
      throw new ForbiddenException('No user found');
    }

    if (!vendor) {
      throw new ForbiddenException('No vendor associated with this user');
    }

    const hasRole = requiredRoles.some((role) =>
      vendor.roles.some((vendorRole) => vendorRole.name === role),
    );
    if (!hasRole) {
      throw new ForbiddenException('You do not have the required role');
    }

    // const permissions = await this.roleService.findPermissionsByRole(
    //   user.roleId,
    // );
    // const permissionNames = permissions.map((permission) => permission.name);

    // return roles.some((role) => permissionNames.includes(role));

    return true;
  }
}
