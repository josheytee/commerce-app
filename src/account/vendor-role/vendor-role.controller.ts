import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { VendorRoles } from '../role/vendor-roles.decorator';
import { AssignRoleDto } from './assign-role.dto';
import { VendorRoleService } from './vendor-role.service';

@Controller('vendors/roles')
export class VendorRoleController {
  constructor(private readonly vendorRoleService: VendorRoleService) {}

  @Post()
  @UseGuards(JwtAuthGuard) // Ensure the user is authenticated
  @VendorRoles('admin') // Ensure the user has the required role (admin) to assign roles
  async assignRole(@Body() assignRoleDto: AssignRoleDto) {
    return this.vendorRoleService.assignRole(assignRoleDto);
  }
}
