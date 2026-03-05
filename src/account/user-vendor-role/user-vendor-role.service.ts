import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserVendorRole } from './user-vendor-role.model';
import { Permission } from '../permission/permission.model';
import { UserVendorRolePermission } from '../permission/user-vendor-role-permission.model';
import { CreateUserVendorRoleDto } from './dto';
import { UserVendorRoleRepository } from './user-vendor-role.repository';

@Injectable()
export class UserVendorRoleService {
  constructor(private userVendorRoleRepository: UserVendorRoleRepository) { }

  async getUserRoles(userId: number) {
    return this.userVendorRoleRepository.getUserRoles(userId);
  }
  async assignRole(createUserVendorRoleDto: CreateUserVendorRoleDto) {
    return this.userVendorRoleRepository.assignRole(createUserVendorRoleDto);
  }

  async getPermissionsForUser(userId: number): Promise<Permission[]> {
    return this.userVendorRoleRepository.getPermissionsForUser(userId);
  }

  // async createPermission(permissionName: string): Promise<Permission> {
  //   const permission = await this.permissionModel.create({
  //     name: permissionName,
  //   });
  //   return permission;
  // }

  // async assignPermissionToUserVendorRole(
  //   userVendorRoleId: number,
  //   permissionId: number,
  // ): Promise<UserVendorRolePermission> {
  //   const userVendorRolePermission =
  //     await this.userVendorRolePermissionModel.create({
  //       user_vendor_role_id: userVendorRoleId,
  //       permission_id: permissionId,
  //     });
  //   return userVendorRolePermission;
  // }
}
