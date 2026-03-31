import { CreateCustomRoleDto } from './dtos/create-custom-role.dto';
import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateRoleDto } from './dtos/create-role.dto';
import {
  PermissionModel,
  RoleModel,
  VendorModel,
  UserVendorRolePermissionModel,
} from 'src/infrastructure';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(RoleModel)
    private readonly roleModel: typeof RoleModel,
    @InjectModel(VendorModel)
    private readonly userVendorRolePermission: typeof UserVendorRolePermissionModel,
    @InjectModel(PermissionModel)
    private permissionModel: typeof PermissionModel,
  ) { }

  async create(createRoleDto: Partial<CreateRoleDto>): Promise<RoleModel> {
    return this.roleModel.create(createRoleDto);
  }

  async findAll(): Promise<RoleModel[]> {
    return this.roleModel.findAll({ include: { all: true } });
  }

  async findByName(name: string): Promise<RoleModel | null> {
    return this.roleModel.findOne({ where: { name } });
  }

  async findOne(id: number): Promise<RoleModel> {
    const role = await this.roleModel.findByPk(id, { include: { all: true } });
    if (!role) {
      throw new NotFoundException('RoleModel not found');
    }
    return role;
  }

  async update(
    id: number,
    updateRoleDto: Partial<CreateRoleDto>,
  ): Promise<RoleModel> {
    const role = await this.findOne(id);
    return role.update(updateRoleDto);
  }

  async remove(id: number): Promise<void> {
    const role = await this.findOne(id);
    await role.destroy();
  }

  // async createRoleWithPermissions(
  //   @Body() createCustomRoleDto: CreateCustomRoleDto,
  // ): Promise<RoleModel> {
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
