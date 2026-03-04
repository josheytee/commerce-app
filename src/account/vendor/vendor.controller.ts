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
import { VendorService } from './vendor.service';
import { Vendor } from './vendor.model';
import { PermissionsGuard } from 'src/account/permission/permissions.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Permissions } from 'src/account/permission/permissions.decorator';
import { TokenAuthGuard } from '../auth/token-auth.guard';
import { AuthenticatedRequest } from '../auth/request/authenticated-request.interface';

@Controller('vendors')
@UseGuards(TokenAuthGuard, PermissionsGuard)
export class VendorController {
  constructor(private readonly vendorService: VendorService) { }

  @Post()
  create(@Body() data: Partial<Vendor>): Promise<Vendor> {
    return this.vendorService.create(data);
  }

  @Get()
  @Permissions('vendor:view')
  findAll(@Req() req: AuthenticatedRequest): Promise<Vendor[]> {
    const user_id = req.user.id; // Extract the user ID from the request
    return this.vendorService.findVendorsByUserId(user_id);
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Vendor> {
    return this.vendorService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() data: Partial<Vendor>,
  ): Promise<Vendor> {
    return this.vendorService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.vendorService.delete(id);
  }
}
