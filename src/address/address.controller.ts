import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { Address } from './address.model';

@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  async create(@Body() createAddressDto: any): Promise<Address> {
    return this.addressService.createAddress(createAddressDto);
  }

  @Get()
  async findAll(): Promise<Address[]> {
    return this.addressService.findAllAddresses();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Address> {
    return this.addressService.findAddressById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAddressDto: any,
  ): Promise<Address> {
    return this.addressService.updateAddress(id, updateAddressDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.addressService.deleteAddress(id);
  }
}
