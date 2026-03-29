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
import { VendorService } from '../vendor.service';
import { Vendor } from '../vendor.model';
import { PermissionsGuard } from 'src/account/permission/permissions.guard';
import { Permissions } from 'src/account/permission/permissions.decorator';
import { TokenAuthGuard } from '../../auth/token-auth.guard';
import { AuthenticatedRequest } from '../../auth/request/authenticated-request.interface';
import { CreateVendorDto } from '../dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiSuccessResponse } from 'src/api.response';

@ApiBearerAuth()
@ApiTags('Admin - Vendors')
@Controller('admin/vendors')
@UseGuards(TokenAuthGuard, PermissionsGuard)
export class AdminVendorController {
  constructor(private readonly vendorService: VendorService) { }

  @Post()
  @ApiSuccessResponse(Vendor)
  create(
    @Body() data: CreateVendorDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Vendor> {
    return this.vendorService.create({ ...data, ...{ user_id: req.user.id } });
  }

  @Get()
  @Permissions('vendor:view')
  @ApiSuccessResponse(Vendor)
  findAll(@Req() req: AuthenticatedRequest): Promise<Vendor[]> {
    const user_id = req.user.id; // Extract the user ID from the request
    return this.vendorService.findVendorsByUserId(user_id);
  }

  @Get(':id')
  @ApiSuccessResponse(Vendor)
  findOne(@Param('id') id: number): Promise<Vendor> {
    return this.vendorService.findById(id);
  }

  @Patch(':id')
  @ApiSuccessResponse(Vendor)
  update(
    @Param('id') id: number,
    @Body() data: Partial<Vendor>,
  ): Promise<Vendor> {
    return this.vendorService.update(id, data);
  }

  @Delete(':id')
  @ApiSuccessResponse(Vendor)
  remove(@Param('id') id: number): Promise<void> {
    return this.vendorService.delete(id);
  }
}
