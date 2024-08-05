// src/controllers/role.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { Role } from './models/role.model';
import { CreateRoleDto } from './dtos/create-role.dto';
import { CreateCustomRoleDto } from './dtos/create-custom-role.dto';
import { Permissions } from 'src/account/permission/permissions.decorator';
import { PermissionsGuard } from 'src/account/permission/permissions.guard';

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

  @Post()
  @Permissions('create-role')
  @UseGuards(PermissionsGuard)
  async createRoleWithPermissions(
    @Body() createCustomRoleDto: CreateCustomRoleDto,
  ) {
    // @todo later
    // const vendorId = req.user.vendorId; // Assuming vendorId is part of the authenticated user's payload
    // return this.roleService.createCustomRole(createCustomRoleDto);
  }

  @Get()
  @Permissions('view-roles')
  async getAllRoles() {
    // return this.roleService.getAllRoles();
    return this.findAll();
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
