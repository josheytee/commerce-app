import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  PermissionModel,
  UserVendorRoleModel,
  UserVendorRolePermissionModel,
} from 'src/infrastructure';

@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(PermissionModel)
    private permissionModel: typeof PermissionModel,
    @InjectModel(UserVendorRoleModel)
    private userVendorRoleModel: typeof UserVendorRoleModel,
    @InjectModel(UserVendorRolePermissionModel)
    private userVendorRolePermissionModel: typeof UserVendorRolePermissionModel,
  ) { }

  async createPermission(name: string): Promise<PermissionModel> {
    return this.permissionModel.create({ name });
  }

  async assignPermissionToRole(
    roleId: number,
    permissionId: number,
  ): Promise<UserVendorRolePermissionModel> {
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
