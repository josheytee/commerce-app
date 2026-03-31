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
import { VendorService } from '../../vendor/onboarding/vendor.service';
import { VendorModel } from 'src/infrastructure/database/models/vendor.model';
import { TokenAuthGuard } from '../../../modules/auth/token-auth.guard';
import { AuthenticatedRequest } from '../../../modules/auth/interfaces/authenticated-request.interface';
import { CreateVendorDto } from '../../vendor/onboarding/dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiSuccessResponse } from 'src/api.response';
import { PermissionsGuard } from 'src/modules/user/permission/permissions.guard';
import { Permissions } from 'src/modules/user/permission/permissions.decorator';

@ApiBearerAuth()
@ApiTags('Admin - Vendors')
@Controller('admin/vendors')
@UseGuards(TokenAuthGuard, PermissionsGuard)
export class AdminVendorController {
  constructor(private readonly vendorService: VendorService) { }

  @Post()
  @ApiSuccessResponse(VendorModel)
  create(
    @Body() data: CreateVendorDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<VendorModel> {
    return this.vendorService.create({ ...data, ...{ user_id: req.user.id } });
  }

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
