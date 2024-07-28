import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { VendorService } from './vendor.service';
import { Vendor } from './vendor.model';

@Controller('vendors')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Post()
  create(@Body() data: Partial<Vendor>): Promise<Vendor> {
    return this.vendorService.create(data);
  }

  @Get()
  findAll(): Promise<Vendor[]> {
    return this.vendorService.findAll();
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
    return this.vendorService.remove(id);
  }
}
