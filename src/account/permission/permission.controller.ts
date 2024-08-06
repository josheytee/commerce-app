import { Controller, Post, Body } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreateAndAssignPermissionsDto } from './create-and-assign-permissions.dto';

@Controller('permissions')
export class PermissionsController {
  constructor(private permissionService: PermissionService) {}

  @Post('create-and-assign')
  async createAndAssignPermission(
    @Body() createAndAssignPermissionsDto: CreateAndAssignPermissionsDto,
  ) {
    // await this.permissionService.createAndAssignPermission(
    //   roleName,
    //   permissionName,
    // );
    return { message: 'Permission assigned to role successfully' };
  }
}
