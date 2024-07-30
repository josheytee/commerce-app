import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateRoleDto } from './create-role.dto';
import { Role } from './models/role.model';
import { Vendor } from '../vendor/vendor.model';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role)
    private readonly roleModel: typeof Role,
    @InjectModel(Vendor)
    private readonly vendorModel: typeof Vendor,
  ) {}

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

  async findRolesForUser(userId: number): Promise<Role[]> {
    const vendor = await this.vendorModel.findOne({
      where: { user_id: userId },
      include: [Role],
    });

    if (!vendor) {
      throw new NotFoundException('Vendor not found for this user');
    }

    return vendor.roles;
  }
}
