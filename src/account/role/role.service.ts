// src/services/role.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './models/role.model';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role)
    private readonly roleModel: typeof Role,
  ) {}

  async findAll(): Promise<Role[]> {
    return this.roleModel.findAll();
  }

  async findOne(id: number): Promise<Role> {
    return this.roleModel.findByPk(id);
  }

  async create(role: Partial<Role>): Promise<Role> {
    return this.roleModel.create(role);
  }

  async update(id: number, role: Partial<Role>): Promise<[number]> {
    return this.roleModel.update(role, { where: { id } });
  }

  async remove(id: number): Promise<void> {
    const role = await this.roleModel.findByPk(id);
    if (role) {
      await role.destroy();
    }
  }
}
