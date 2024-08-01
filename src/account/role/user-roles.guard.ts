import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleService } from './role.service';

@Injectable()
export class UserRolesGuard implements CanActivate {
  private readonly logger = new Logger(UserRolesGuard.name);

  constructor(
    private reflector: Reflector,
    private roleService: RoleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      this.logger.warn('No roles specified for the route');
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      this.logger.error('User not found in the request');
      return false;
    }

    this.logger.log(`User is trying to access ${request.url}`);

    try {
      const permissions = await this.roleService.findPermissionsByRole(
        user.role_id,
      );
      const permissionNames = permissions.map((permission) => permission.name);
      const hasRole = roles.some((role) => permissionNames.includes(role));

      if (!hasRole) {
        this.logger.warn(`User does not have the required roles: ${roles}`);
      }

      return hasRole;
    } catch (error) {
      this.logger.error('Error while validating user roles', error.stack);
      return false;
    }
  }
}
