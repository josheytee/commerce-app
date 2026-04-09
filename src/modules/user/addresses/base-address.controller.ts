// src/modules/address/base-address.controller.ts
import {
    Controller,
    Get,
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
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';
import { AddressService } from './address.service';
import { UpdateAddressDto, AddressResponseDto } from './dto';
import { AddressableTypeEnum } from 'src/shared/enums';

@Controller('addresses')
@ApiBearerAuth()
export class BaseAddressController {
    constructor(private readonly addressService: AddressService) { }

    @Get()
    @ApiOperation({ summary: 'Get all addresses with filters' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns paginated addresses',
    })
    async findAll(@Query() query: any) {
        const result = await this.addressService.findAll(query);
        return {
            success: true,
            message: 'Addresses retrieved successfully',
            data: result.data,
            meta: {
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages,
            },
        };
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get address by ID' })
    @ApiParam({ name: 'id', description: 'Address ID', type: Number })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns address details',
        type: AddressResponseDto,
    })
    async getAddressById(@Param('id', ParseIntPipe) id: number) {
        const address = await this.addressService.getAddressById(id);
        return {
            success: true,
            message: 'Address retrieved successfully',
            data: address,
        };
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update address' })
    @ApiParam({ name: 'id', description: 'Address ID', type: Number })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Address updated successfully',
        type: AddressResponseDto,
    })
    async updateAddress(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateAddressDto: UpdateAddressDto,
    ) {
        const address = await this.addressService.updateAddress(
            id,
            updateAddressDto,
        );
        return {
            success: true,
            message: 'Address updated successfully',
            data: address,
        };
    }

    @Put(':id/verify')
    @ApiOperation({ summary: 'Verify address' })
    @ApiParam({ name: 'id', description: 'Address ID', type: Number })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Address verified successfully',
        type: AddressResponseDto,
    })
    async verifyAddress(
        @Param('id', ParseIntPipe) id: number,
        @Query('verified', new DefaultValuePipe(true)) verified: boolean,
    ) {
        const address = await this.addressService.verifyAddress(id, verified);
        return {
            success: true,
            message: `Address ${verified ? 'verified' : 'unverified'} successfully`,
            data: address,
        };
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete address (soft delete)' })
    @ApiParam({ name: 'id', description: 'Address ID', type: Number })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Address deleted successfully',
    })
    async deleteAddress(@Param('id', ParseIntPipe) id: number) {
        return this.addressService.deleteAddress(id);
    }

    @Get('search/:term')
    @ApiOperation({ summary: 'Search addresses' })
    @ApiParam({ name: 'term', description: 'Search term', type: String })
    @ApiQuery({ name: 'entityType', enum: AddressableTypeEnum, required: false })
    @ApiQuery({ name: 'limit', type: Number, required: false, example: 20 })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Search results',
        type: [AddressResponseDto],
    })
    async searchAddresses(
        @Param('term') term: string,
        @Query('entityType') entityType?: AddressableTypeEnum,
        @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
    ) {
        const addresses = await this.addressService.searchAddresses(
            term,
            entityType,
            limit,
        );
        return {
            success: true,
            message: `Found ${addresses.length} addresses matching "${term}"`,
            data: addresses,
        };
    }

    @Get('nearby')
    @ApiOperation({ summary: 'Find nearby addresses' })
    @ApiQuery({ name: 'latitude', type: Number, required: true })
    @ApiQuery({ name: 'longitude', type: Number, required: true })
    @ApiQuery({ name: 'radiusKm', type: Number, required: true })
    @ApiQuery({ name: 'entityType', enum: AddressableTypeEnum, required: false })
    @ApiQuery({ name: 'limit', type: Number, required: false, example: 50 })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Nearby addresses',
        type: [AddressResponseDto],
    })
    async findNearbyAddresses(
        @Query('latitude') latitude: number,
        @Query('longitude') longitude: number,
        @Query('radiusKm') radiusKm: number,
        @Query('entityType') entityType?: AddressableTypeEnum,
        @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit?: number,
    ) {
        const addresses = await this.addressService.findNearbyAddresses(
            latitude,
            longitude,
            radiusKm,
            entityType,
            limit,
        );
        return {
            success: true,
            message: `Found ${addresses.length} addresses within ${radiusKm}km radius`,
            data: addresses,
        };
    }

    @Get('stats/:entityType/:entityId')
    @ApiOperation({ summary: 'Get address statistics for an entity' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Address statistics',
    })
    async getAddressStats(
        @Param('entityType') entityType: AddressableTypeEnum,
        @Param('entityId', ParseIntPipe) entityId: number,
    ) {
        const stats = await this.addressService.getAddressStats(
            entityType,
            entityId,
        );
        return {
            success: true,
            message: 'Address statistics retrieved successfully',
            data: stats,
        };
    }
}
