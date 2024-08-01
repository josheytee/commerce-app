import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleService } from './role.service';
import { VendorService } from '../vendor/vendor.service';

@Injectable()
export class VendorRolesGuard implements CanActivate {
  private readonly logger = new Logger(VendorRolesGuard.name);

  constructor(
    private reflector: Reflector,
    private roleService: RoleService,
    private vendorService: VendorService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>(
      'vendor_roles',
      context.getHandler(),
    );
    if (!roles) {
      this.logger.warn('No roles specified for the route');
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    // const vendor = request.vendor;

    const vendor = await this.vendorService.findByUserId(user.id);

    if (!vendor) {
      this.logger.error('Vendor not found in the request');
      return false;
    }

    this.logger.log(`Vendor is trying to access ${request.url}`);

    try {
      const permissions = await this.roleService.findPermissionsByVendorRole(
        vendor.role_id,
      );
      const permissionNames = permissions.map((permission) => permission.name);
      const hasRole = roles.some((role) => permissionNames.includes(role));

      if (!hasRole) {
        this.logger.warn(`Vendor does not have the required roles: ${roles}`);
      }

      return hasRole;
    } catch (error) {
      this.logger.error('Error while validating vendor roles', error.stack);
      return false;
    }
  }
}
