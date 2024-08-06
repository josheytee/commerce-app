import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserVendorRoleService } from '../user-vendor-role/user-vendor-role.service';
import { PERMISSIONS_KEY } from './permissions.decorator';
import { OWNER_ROLE } from './constants';

@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger(PermissionsGuard.name);

  constructor(
    private reflector: Reflector,
    private userVendorRoleService: UserVendorRoleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>(
      PERMISSIONS_KEY,
      context.getHandler(),
    );

    if (!requiredPermissions) {
      return true;
    }

    const { user, url } = context.switchToHttp().getRequest();

    // const request = context.switchToHttp().getRequest();
    // const user = request.user;

    // console.log(request, 'request');

    if (!user) {
      this.logger.error('User not found in the request');
      return false;
    }
    const userId = user?.userId;
    // this.vendorService.findByUserId(userId);

    this.logger.log(`User is trying to access ${url}`);

    const userRoles = await this.userVendorRoleService.getUserRoles(userId);

    // const userPermissions = userRoles.flatMap((role) =>
    //   role.permissions.map((permission) => permission.name),
    // );

    const userPermissions = userRoles.reduce(
      (acc, role) => {
        if (acc.isOwner) {
          return acc;
        }

        if (role.role_id === 1) {
          acc.isOwner = true;
        }
        const permissions = role.permissions.map(
          (permission) => permission.name,
        );
        acc.permissions = acc.permissions.concat(permissions);
        return acc;
      },
      { permissions: [], isOwner: false },
    ).permissions;

    const hasPermission = () =>
      requiredPermissions.every((permission) =>
        userPermissions.includes(permission),
      );

    if (!hasPermission()) {
      this.logger.warn(
        `User ${userId} does not have the required permissions: ${requiredPermissions.toString()}`,
      );
      throw new ForbiddenException(
        'You do not have the required permissions: ' +
          requiredPermissions.toString(),
      );
    }

    this.logger.log(
      `User ${userId} has the required permissions: ${requiredPermissions.toString()}`,
    );
    return true;
  }
}
