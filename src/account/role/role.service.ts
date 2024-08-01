import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateRoleDto } from './create-role.dto';
import { Role } from './models/role.model';
import { Vendor } from '../vendor/vendor.model';
import { Permission } from './models/permission.model';
import { RolePermission } from './models/role-permission.model';
import { VendorRole } from './models/vendor-role.model';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role)
    private readonly roleModel: typeof Role,
    @InjectModel(Vendor)
    private readonly vendorModel: typeof Vendor,
    @InjectModel(Permission) private permissionModel: typeof Permission,
    @InjectModel(RolePermission)
    private rolePermissionModel: typeof RolePermission,
  ) {}

  async create(createRoleDto: Partial<CreateRoleDto>): Promise<Role> {
    return this.roleModel.create(createRoleDto);
  }

  async findPermissionsByRole(role_id: number): Promise<Permission[]> {
    const rolePermissions = await this.rolePermissionModel.findAll({
      where: { role_id },
    });
    const permission_ids = rolePermissions.map((rp) => rp.permission_id);
    return this.permissionModel.findAll({ where: { id: permission_ids } });
  }

  async findPermissionsByVendorRole(role_id: number): Promise<Permission[]> {
    const vendorRolePermissions = await this.rolePermissionModel.findAll({
      where: { role_id },
    });
    const permission_ids = vendorRolePermissions.map((vr) => vr.permission_id);
    return this.permissionModel.findAll({ where: { id: permission_ids } });
  }

  async findAll(): Promise<Role[]> {
    return this.roleModel.findAll({ include: { all: true } });
  }

  async findByName(name: string): Promise<Role | null> {
    return this.roleModel.findOne({ where: { name } });
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.roleModel.findByPk(id, { include: { all: true } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }

  async update(
    id: number,
    updateRoleDto: Partial<CreateRoleDto>,
  ): Promise<Role> {
    const role = await this.findOne(id);
    return role.update(updateRoleDto);
  }

  async remove(id: number): Promise<void> {
    const role = await this.findOne(id);
    await role.destroy();
  }

  async findRolesForUser(user_id: number): Promise<Role[]> {
    const vendor = await this.vendorModel.findOne({
      where: { user_id: user_id },
      include: [Role],
    });

    if (!vendor) {
      throw new NotFoundException('Vendor not found for this user');
    }

    return vendor.roles;
  }
}
