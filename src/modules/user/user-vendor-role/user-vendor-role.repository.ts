// repositories/vendor.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from 'src/infrastructure/database/repositories/base.repository';
import { CreateUserVendorRoleDto } from './dto';
import { PermissionModel, UserVendorRoleModel } from 'src/infrastructure';

@Injectable()
export class UserVendorRoleRepository extends BaseRepository<UserVendorRoleModel> {
    constructor(
        @InjectModel(UserVendorRoleModel)
        private userVendorRoleModel: typeof UserVendorRoleModel,
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
                    model: PermissionModel,
                    through: { attributes: [] }, // This removes the extra junction table attributes
                },
            ],
        });
    }

    public async getPermissionsForUser(
        userId: number,
    ): Promise<PermissionModel[]> {
        const roles = await this.userVendorRoleModel.findAll({
            include: [
                {
                    model: PermissionModel,
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
    // ): Promise<UserVendorRolePermissionModel> {
    //     const userVendorRolePermission =
    //         await this.userVendorRolePermissionModel.create({
    //             user_vendor_role_id: userVendorRoleId,
    //             permission_id: permissionId,
    //         });
    //     return userVendorRolePermission;
    // }
}
