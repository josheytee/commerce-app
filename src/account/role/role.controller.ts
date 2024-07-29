// src/controllers/role.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { Role } from './models/role.model';
import { CreateRoleDto } from './create-role.dto';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  async findAll(): Promise<Role[]> {
    return this.roleService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Role> {
    return this.roleService.findOne(id);
  }

  @Post()
  async create(@Body() role: CreateRoleDto): Promise<Role> {
    return this.roleService.create(role);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() role: Partial<Role>,
  ): Promise<Role> {
    return this.roleService.update(id, role);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.roleService.remove(id);
  }
}
