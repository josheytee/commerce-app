import { CreateCustomRoleDto } from './dtos/create-custom-role.dto';
import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateRoleDto } from './dtos/create-role.dto';
import { Role } from './models/role.model';
import { Vendor } from '../../vendor/onboarding/vendor.model';
import { Permission } from '../permission/permission.model';
import { UserVendorRolePermission } from '../permission/user-vendor-role-permission.model';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role)
    private readonly roleModel: typeof Role,
    @InjectModel(Vendor)
    private readonly userVendorRolePermission: typeof UserVendorRolePermission,
    @InjectModel(Permission) private permissionModel: typeof Permission,
  ) { }

  async create(createRoleDto: Partial<CreateRoleDto>): Promise<Role> {
    return this.roleModel.create(createRoleDto);
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

  // async createRoleWithPermissions(
  //   @Body() createCustomRoleDto: CreateCustomRoleDto,
  // ): Promise<Role> {
  //   const permissions = await this.permissionModel.findAll({
  //     where: { id: createCustomRoleDto.permissionIds },
  //   });
  //   const customRole = await this.userVendorRolePermission.create({
  //     name: createCustomRoleDto.name,
  //     created_by_vendor_id: createCustomRoleDto.vendor_id,
  //   });
  //   await customRole.$set('permissions', permissions);
  //   return customRole;
  // }
}
