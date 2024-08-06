import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Permission } from './permission.model';
import { UserVendorRole } from '../user-vendor-role/user-vendor-role.model';
import { UserVendorRolePermission } from './user-vendor-role-permission.model';

@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(Permission)
    private permissionModel: typeof Permission,
    @InjectModel(UserVendorRole)
    private userVendorRoleModel: typeof UserVendorRole,
    @InjectModel(UserVendorRolePermission)
    private userVendorRolePermissionModel: typeof UserVendorRolePermission,
  ) {}

  async createPermission(name: string): Promise<Permission> {
    return this.permissionModel.create({ name });
  }

  async assignPermissionToRole(
    roleId: number,
    permissionId: number,
  ): Promise<UserVendorRolePermission> {
    return this.userVendorRolePermissionModel.create({
      user_vendor_role_id: roleId,
      permission_id: permissionId,
    });
  }

  //   async createAndAssignPermission(
  //     roleName: string,
  //     permissionName: string,
  //   ): Promise<void> {

  //     const [role, createdRole] = await this.userVendorRoleModel.findOrCreate({
  //       where: { name: roleName },
  //     });

  //     const [permission, createdPermission] =
  //       await this.permissionModel.findOrCreate({
  //         where: { name: permissionName },
  //       });

  //     await this.assignPermissionToRole(role.id, permission.id);
  //   }
}
