import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UserVendorRoleService } from './user-vendor-role.service';
import { CreateUserVendorRoleDto } from './dto/create-user-vendor-role.dto';

@Controller('user-vendor-roles')
export class UserVendorRoleController {
  constructor(private readonly userVendorRoleService: UserVendorRoleService) {}

  @Post()
  async assignRole(@Body() createUserVendorRoleDto: CreateUserVendorRoleDto) {
    return this.userVendorRoleService.assignRole(createUserVendorRoleDto);
  }

  @Get(':userId')
  async getUserRoles(@Param('userId') userId: number) {
    return this.userVendorRoleService.getUserRoles(userId);
  }
}
