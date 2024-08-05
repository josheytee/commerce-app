import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserVendorRole } from './user-vendor-role.model';
import { CreateUserVendorRoleDto } from './create-user-vendor-role.dto';
import { Permission } from '../permission/permission.model';
import { UserVendorRolePermission } from '../permission/user-vendor-role-permission.model';

@Injectable()
export class UserVendorRoleService {
  permissionModel: any;
  userVendorRolePermissionModel: any;
  constructor(
    @InjectModel(UserVendorRole)
    private userVendorRoleModel: typeof UserVendorRole,
  ) {}

  async assignRole(createUserVendorRoleDto: CreateUserVendorRoleDto) {
    return this.userVendorRoleModel.create(createUserVendorRoleDto);
  }

  async getUserRoles(userId: number) {
    return this.userVendorRoleModel.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Permission,
          through: { attributes: [] }, // This removes the extra junction table attributes
        },
      ],
    });
  }
  async getPermissionsForUser(userId: number): Promise<Permission[]> {
    const roles = await this.userVendorRoleModel.findAll({
      include: [
        {
          model: Permission,
          through: { where: { user_id: userId } },
        },
      ],
    });
    return roles.flatMap((role) => role.permissions);
  }

  async createPermission(permissionName: string): Promise<Permission> {
    const permission = await this.permissionModel.create({
      name: permissionName,
    });
    return permission;
  }

  async assignPermissionToUserVendorRole(
    userVendorRoleId: number,
    permissionId: number,
  ): Promise<UserVendorRolePermission> {
    const userVendorRolePermission =
      await this.userVendorRolePermissionModel.create({
        user_vendor_role_id: userVendorRoleId,
        permission_id: permissionId,
      });
    return userVendorRolePermission;
  }
}
