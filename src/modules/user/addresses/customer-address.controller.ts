// src/modules/address/customer-address.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { AddressService } from './address.service';
import { CreateAddressDto, UpdateAddressDto, AddressResponseDto } from './dto';
import { AddressableTypeEnum, AddressTypeEnum } from 'src/shared/enums';

@ApiTags('Customer Addresses')
@Controller('customers/:customerId/addresses')
@ApiBearerAuth()
export class CustomerAddressController {
  constructor(private readonly addressService: AddressService) { }

  // ==================== CREATE ====================

  @Post()
  @ApiOperation({
    summary: 'Create a new address for a customer',
    description: 'Creates an address for a specific customer',
  })
  @ApiParam({ name: 'customerId', description: 'Customer ID', type: Number })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Address created successfully',
    type: AddressResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Customer not found',
  })
  @ApiBody({ type: CreateAddressDto })
  async createCustomerAddress(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Body() createAddressDto: CreateAddressDto,
  ) {
    const address = await this.addressService.createAddress({
      ...createAddressDto,
      addressable_id: customerId,
      addressable_type: AddressableTypeEnum.CUSTOMER,
    });
    return address;
  }

  // ==================== GET ADDRESSES ====================

  @Get()
  @ApiOperation({ summary: 'Get all addresses for a customer' })
  @ApiParam({ name: 'customerId', description: 'Customer ID', type: Number })
  @ApiQuery({ name: 'addressType', enum: AddressTypeEnum, required: false })
  @ApiQuery({ name: 'includeDeleted', type: Boolean, required: false })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns customer addresses',
    type: [AddressResponseDto],
  })
  async getCustomerAddresses(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Query('addressType') addressType?: AddressTypeEnum,
    @Query('includeDeleted') includeDeleted?: boolean,
  ) {
    const addresses = await this.addressService.getAddressesByEntity(
      AddressableTypeEnum.CUSTOMER,
      customerId,
      { addressType, includeDeleted },
    );
    return {
      message: 'Customer Address Fetched successfully!',
      items: addresses,
      meta: {
        meta: { count: addresses.length },
      },
    };
  }

  @Get('/default')
  @ApiOperation({ summary: 'Get customer default address' })
  @ApiParam({ name: 'customerId', description: 'Customer ID', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns default address',
    type: AddressResponseDto,
  })
  async getCustomerDefaultAddress(
    @Param('customerId', ParseIntPipe) customerId: number,
  ) {
    const address = await this.addressService.getDefaultAddress(
      AddressableTypeEnum.CUSTOMER,
      customerId,
    );
    return {
      message: 'Default address retrieved successfully',
      data: address,
    };
  }

  @Get('/billing')
  @ApiOperation({ summary: 'Get customer billing addresses' })
  @ApiParam({ name: 'customerId', description: 'Customer ID', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns billing addresses',
    type: [AddressResponseDto],
  })
  async getCustomerBillingAddresses(
    @Param('customerId', ParseIntPipe) customerId: number,
  ) {
    const addresses =
      await this.addressService.getCustomerBillingAddresses(customerId);
    return {
      message: 'Billing addresses retrieved successfully',
      data: addresses,
      meta: { count: addresses.length },
    };
  }

  @Get('/shipping')
  @ApiOperation({ summary: 'Get customer shipping addresses' })
  @ApiParam({ name: 'customerId', description: 'Customer ID', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns shipping addresses',
    type: [AddressResponseDto],
  })
  async getCustomerShippingAddresses(
    @Param('customerId', ParseIntPipe) customerId: number,
  ) {
    const addresses =
      await this.addressService.getCustomerShippingAddresses(customerId);
    return {
      message: 'Shipping addresses retrieved successfully',
      data: addresses,
      meta: { count: addresses.length },
    };
  }

  // ==================== UPDATE ====================

  @Put(':addressId/default')
  @ApiOperation({ summary: 'Set customer default address' })
  @ApiParam({ name: 'customerId', description: 'Customer ID', type: Number })
  @ApiParam({ name: 'addressId', description: 'Address ID', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Default address set successfully',
    type: AddressResponseDto,
  })
  async setCustomerDefaultAddress(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Param('addressId', ParseIntPipe) addressId: number,
  ) {
    const address = await this.addressService.setDefaultAddress(
      AddressableTypeEnum.CUSTOMER,
      customerId,
      addressId,
    );
    return {
      message: 'Default address set successfully',
      data: address,
    };
  }

  @Put(':addressId')
  @ApiOperation({ summary: 'Update a specific customer address' })
  @ApiParam({ name: 'customerId', description: 'Customer ID', type: Number })
  @ApiParam({ name: 'addressId', description: 'Address ID', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Address updated successfully',
    type: AddressResponseDto,
  })
  async updateCustomerAddress(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Param('addressId', ParseIntPipe) addressId: number,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    // First verify address belongs to customer
    await this.addressService.verifyAddressOwnership(
      addressId,
      AddressableTypeEnum.CUSTOMER,
      customerId,
    );

    const address = await this.addressService.updateAddress(
      addressId,
      updateAddressDto,
    );
    return {
      message: 'Customer address updated successfully',
      data: address,
    };
  }

  // ==================== DELETE ====================

  @Delete(':addressId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a specific customer address' })
  @ApiParam({ name: 'customerId', description: 'Customer ID', type: Number })
  @ApiParam({ name: 'addressId', description: 'Address ID', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Address deleted successfully',
  })
  async deleteCustomerAddress(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Param('addressId', ParseIntPipe) addressId: number,
  ) {
    // First verify address belongs to customer
    await this.addressService.verifyAddressOwnership(
      addressId,
      AddressableTypeEnum.CUSTOMER,
      customerId,
    );

    return this.addressService.deleteAddress(addressId);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete all addresses for a customer' })
  @ApiParam({ name: 'customerId', description: 'Customer ID', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Customer addresses deleted successfully',
  })
  async deleteAllCustomerAddresses(
    @Param('customerId', ParseIntPipe) customerId: number,
  ) {
    return this.addressService.deleteAddressesByEntity(
      AddressableTypeEnum.CUSTOMER,
      customerId,
    );
  }

  // ==================== BULK OPERATIONS ====================

  @Post('/bulk')
  @ApiOperation({ summary: 'Bulk create addresses for a customer' })
  @ApiParam({ name: 'customerId', description: 'Customer ID', type: Number })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Addresses created successfully',
    type: [AddressResponseDto],
  })
  async bulkCreateCustomerAddresses(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Body() addresses: CreateAddressDto[],
  ) {
    const addressesWithCustomer = addresses.map((addr) => ({
      ...addr,
      addressable_id: customerId,
      addressable_type: AddressableTypeEnum.CUSTOMER,
    }));

    const results = await this.addressService.bulkCreateAddresses(
      addressesWithCustomer,
    );
    return {
      message: `${results.length} addresses created successfully for customer ${customerId}`,
      data: results,
    };
  }
}
