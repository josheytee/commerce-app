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
import { AddressableTypeEnum } from 'src/shared/enums';

@ApiTags('Store Addresses')
@Controller('stores/:storeId/addresses')
@ApiBearerAuth()
export class StoreAddressController {
    constructor(private readonly addressService: AddressService) { }

    // ==================== CREATE ====================

    @Post()
    @ApiOperation({
        summary: 'Create a new address for a store',
        description: 'Creates an address for a specific store',
    })
    @ApiParam({ name: 'storeId', description: 'Store ID', type: Number })
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
        description: 'Store not found',
    })
    @ApiBody({ type: CreateAddressDto })
    async createStoreAddress(
        @Param('storeId', ParseIntPipe) storeId: number,
        @Body() createAddressDto: CreateAddressDto,
    ) {
        const address = await this.addressService.createAddress({
            ...createAddressDto,
            addressable_id: storeId,
            addressable_type: AddressableTypeEnum.STORE,
        });
        return {
            ...address,
        };
    }

    // ==================== GET ADDRESSES ====================

    @Get()
    @ApiOperation({ summary: 'Get all addresses for a store' })
    @ApiParam({ name: 'storeId', description: 'Store ID', type: Number })
    @ApiQuery({ name: 'onlyPrimary', type: Boolean, required: false })
    @ApiQuery({ name: 'includeInactive', type: Boolean, required: false })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns store addresses',
        type: [AddressResponseDto],
    })
    async getStoreAddresses(
        @Param('storeId', ParseIntPipe) storeId: number,
        // @Query('onlyPrimary') onlyPrimary?: boolean,
        // @Query('includeInactive') includeInactive?: boolean,
    ) {
        const addresses = await this.addressService.getAddressesByEntity(
            AddressableTypeEnum.STORE,
            storeId,
            // { onlyPrimary, includeInactive },
        );
        return {
            data: addresses,
            meta: { count: addresses.length },
        };
    }

    @Get('/default')
    @ApiOperation({ summary: 'Get store default address' })
    @ApiParam({ name: 'storeId', description: 'Store ID', type: Number })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns default address',
        type: AddressResponseDto,
    })
    async getStoreDefaultAddress(
        @Param('storeId', ParseIntPipe) storeId: number,
    ) {
        const address = await this.addressService.getDefaultAddress(
            AddressableTypeEnum.STORE,
            storeId,
        );
        return {
            message: 'Default address retrieved successfully',
            data: address,
        };
    }

    @Get(':storeId/primary')
    @ApiOperation({ summary: 'Get store primary address' })
    @ApiParam({ name: 'storeId', description: 'Store ID', type: Number })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns primary address',
        type: AddressResponseDto,
    })
    async getStorePrimaryAddress(
        @Param('storeId', ParseIntPipe) storeId: number,
    ) {
        const address = await this.addressService.getPrimaryStoreAddress(storeId);
        return {
            message: 'Primary address retrieved successfully',
            data: address,
        };
    }

    @Get('/warehouse')
    @ApiOperation({ summary: 'Get warehouse addresses for a store' })
    @ApiParam({ name: 'storeId', description: 'Store ID', type: Number })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns warehouse addresses',
        type: [AddressResponseDto],
    })
    async getStoreWarehouseAddresses(
        @Param('storeId', ParseIntPipe) storeId: number,
    ) {
        const addresses = await this.addressService.getStoreAddressesByLabel(
            storeId,
            'warehouse',
        );
        return {
            message: 'Warehouse addresses retrieved successfully',
            data: addresses,
            meta: { count: addresses.length },
        };
    }

    @Get('/retail')
    @ApiOperation({ summary: 'Get retail addresses for a store' })
    @ApiParam({ name: 'storeId', description: 'Store ID', type: Number })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns retail addresses',
        type: [AddressResponseDto],
    })
    async getStoreRetailAddresses(
        @Param('storeId', ParseIntPipe) storeId: number,
    ) {
        const addresses = await this.addressService.getStoreAddressesByLabel(
            storeId,
            'retail',
        );
        return {
            message: 'Retail addresses retrieved successfully',
            items: addresses,
            meta: { count: addresses.length },
        };
    }

    // ==================== UPDATE ====================

    @Put(':addressId/default')
    @ApiOperation({ summary: 'Set store default address' })
    @ApiParam({ name: 'storeId', description: 'Store ID', type: Number })
    @ApiParam({ name: 'addressId', description: 'Address ID', type: Number })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Default address set successfully',
        type: AddressResponseDto,
    })
    async setStoreDefaultAddress(
        @Param('storeId', ParseIntPipe) storeId: number,
        @Param('addressId', ParseIntPipe) addressId: number,
    ) {
        const address = await this.addressService.setDefaultAddress(
            AddressableTypeEnum.STORE,
            storeId,
            addressId,
        );
        return {
            message: 'Default address set successfully',
            data: address,
        };
    }

    @Put(':addressId/primary')
    @ApiOperation({ summary: 'Set store primary address' })
    @ApiParam({ name: 'storeId', description: 'Store ID', type: Number })
    @ApiParam({ name: 'addressId', description: 'Address ID', type: Number })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Primary address set successfully',
        type: AddressResponseDto,
    })
    async setStorePrimaryAddress(
        @Param('storeId', ParseIntPipe) storeId: number,
        @Param('addressId', ParseIntPipe) addressId: number,
    ) {
        const address = await this.addressService.setPrimaryStoreAddress(
            storeId,
            addressId,
        );
        return {
            message: 'Primary address set successfully',
            data: address,
        };
    }

    @Put(':addressId')
    @ApiOperation({ summary: 'Update a specific store address' })
    @ApiParam({ name: 'storeId', description: 'Store ID', type: Number })
    @ApiParam({ name: 'addressId', description: 'Address ID', type: Number })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Address updated successfully',
        type: AddressResponseDto,
    })
    async updateStoreAddress(
        @Param('storeId', ParseIntPipe) storeId: number,
        @Param('addressId', ParseIntPipe) addressId: number,
        @Body() updateAddressDto: UpdateAddressDto,
    ) {
        // First verify address belongs to store
        await this.addressService.verifyAddressOwnership(
            addressId,
            AddressableTypeEnum.STORE,
            storeId,
        );

        const address = await this.addressService.updateAddress(
            addressId,
            updateAddressDto,
        );
        return {
            message: 'Store address updated successfully',
            data: address,
        };
    }

    // ==================== DELETE ====================

    @Delete(':addressId')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete a specific store address' })
    @ApiParam({ name: 'storeId', description: 'Store ID', type: Number })
    @ApiParam({ name: 'addressId', description: 'Address ID', type: Number })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Address deleted successfully',
    })
    async deleteStoreAddress(
        @Param('storeId', ParseIntPipe) storeId: number,
        @Param('addressId', ParseIntPipe) addressId: number,
    ) {
        // First verify address belongs to store
        await this.addressService.verifyAddressOwnership(
            addressId,
            AddressableTypeEnum.STORE,
            storeId,
        );

        return this.addressService.deleteAddress(addressId);
    }

    @Delete()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete all addresses for a store' })
    @ApiParam({ name: 'storeId', description: 'Store ID', type: Number })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Store addresses deleted successfully',
    })
    async deleteAllStoreAddresses(
        @Param('storeId', ParseIntPipe) storeId: number,
    ) {
        return this.addressService.deleteAddressesByEntity(
            AddressableTypeEnum.STORE,
            storeId,
        );
    }

    // ==================== BULK OPERATIONS ====================

    @Post('bulk/:storeId')
    @ApiOperation({ summary: 'Bulk create addresses for a store' })
    @ApiParam({ name: 'storeId', description: 'Store ID', type: Number })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Addresses created successfully',
        type: [AddressResponseDto],
    })
    async bulkCreateStoreAddresses(
        @Param('storeId', ParseIntPipe) storeId: number,
        @Body() addresses: CreateAddressDto[],
    ) {
        const addressesWithStore = addresses.map((addr) => ({
            ...addr,
            addressable_id: storeId,
            addressable_type: AddressableTypeEnum.STORE,
        }));

        const results =
            await this.addressService.bulkCreateAddresses(addressesWithStore);
        return {
            message: `${results.length} addresses created successfully for store ${storeId}`,
            data: results,
        };
    }
}
