import { Injectable } from '@nestjs/common';
import { CreateUserVendorRoleDto } from './dto';
import { UserVendorRoleRepository } from './user-vendor-role.repository';
import { PermissionModel } from 'src/infrastructure';

@Injectable()
export class UserVendorRoleService {
  constructor(private userVendorRoleRepository: UserVendorRoleRepository) { }

  async getUserRoles(userId: number) {
    return this.userVendorRoleRepository.getUserRoles(userId);
  }
  async assignRole(createUserVendorRoleDto: CreateUserVendorRoleDto) {
    return this.userVendorRoleRepository.assignRole(createUserVendorRoleDto);
  }

  async getPermissionsForUser(userId: number): Promise<PermissionModel[]> {
    return this.userVendorRoleRepository.getPermissionsForUser(userId);
  }

  // async createPermission(permissionName: string): Promise<PermissionModel> {
  //   const permission = await this.permissionModel.create({
  //     name: permissionName,
  //   });
  //   return permission;
  // }

  // async assignPermissionToUserVendorRole(
  //   userVendorRoleId: number,
  //   permissionId: number,
  // ): Promise<UserVendorRolePermissionModel> {
  //   const userVendorRolePermission =
  //     await this.userVendorRolePermissionModel.create({
  //       user_vendor_role_id: userVendorRoleId,
  //       permission_id: permissionId,
  //     });
  //   return userVendorRolePermission;
  // }
}
