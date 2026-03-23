// repositories/vendor.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from 'src/database/repositories/base.repository';
import { Role } from '../role/models/role.model';
import { UserVendorRole } from './user-vendor-role.model';
import { CreateUserVendorRoleDto } from './dto';
import { Permission } from '../permission/permission.model';

@Injectable()
export class UserVendorRoleRepository extends BaseRepository<UserVendorRole> {
    constructor(
        @InjectModel(UserVendorRole)
        private userVendorRoleModel: typeof UserVendorRole,
    ) {
        super(userVendorRoleModel);
    }

    async assignRole(createUserVendorRoleDto: CreateUserVendorRoleDto) {
        return this.create(createUserVendorRoleDto);
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

    public async getPermissionsForUser(userId: number): Promise<Permission[]> {
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

    // async createPermission(permissionName: string): Promise<Permission> {
    //     const permission = await this.permissionModel.create({
    //         name: permissionName,
    //     });
    //     return permission;
    // }

    // async assignPermissionToUserVendorRole(
    //     userVendorRoleId: number,
    //     permissionId: number,
    // ): Promise<UserVendorRolePermission> {
    //     const userVendorRolePermission =
    //         await this.userVendorRolePermissionModel.create({
    //             user_vendor_role_id: userVendorRoleId,
    //             permission_id: permissionId,
    //         });
    //     return userVendorRolePermission;
    // }
}
