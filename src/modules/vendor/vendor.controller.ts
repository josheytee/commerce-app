import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { VendorService } from './onboarding/vendor.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiSuccessResponse } from 'src/api.response';
import { TokenAuthGuard } from 'src/modules/auth/token-auth.guard';
import { PermissionsGuard } from 'src/modules/user/permission/permissions.guard';
import { AuthenticatedRequest } from 'src/modules/auth/interfaces';
import { Permissions } from 'src/modules/user/permission/permissions.decorator';
import { VendorModel } from 'src/infrastructure';

@ApiBearerAuth()
@ApiTags('VendorModel')
@Controller('vendors')
@UseGuards(TokenAuthGuard, PermissionsGuard)
export class VendorController {
  constructor(private readonly vendorService: VendorService) { }

  @Get()
  @Permissions('vendor:view')
  @ApiSuccessResponse(VendorModel)
  findAll(@Req() req: AuthenticatedRequest): Promise<VendorModel[]> {
    const user_id = req.user.id; // Extract the user ID from the request
    return this.vendorService.findVendorsByUserId(user_id);
  }

  @Get(':id')
  @ApiSuccessResponse(VendorModel)
  findOne(@Param('id') id: number): Promise<VendorModel> {
    return this.vendorService.findById(id);
  }

  @Patch(':id')
  @ApiSuccessResponse(VendorModel)
  update(
    @Param('id') id: number,
    @Body() data: Partial<VendorModel>,
  ): Promise<VendorModel> {
    return this.vendorService.update(id, data);
  }

  @Delete(':id')
  @ApiSuccessResponse(VendorModel)
  remove(@Param('id') id: number): Promise<void> {
    return this.vendorService.delete(id);
  }
}
