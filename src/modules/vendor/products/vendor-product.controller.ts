import { Body, Controller, Post } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiOperation,
    ApiProduces,
    ApiResponse,
    ApiSecurity,
} from '@nestjs/swagger';
import { CreateProductDto } from './requests/create-product.dto';
import { ErrorResponseDto } from 'src/shared/dto/common/error-response.dto';
import { ProductDetailResponseDto } from './responses/product-detail-response.dto';
import { ApiResponseDto } from 'src/shared/dto/common/api-response.dto';

@Controller('vendor/products')
export class VendorProductsController {
    @Post()
    @ApiOperation({
        summary: 'Create new product',
        description: `
      Creates a new product in the vendor's store inventory.
      
      **Requirements:**
      - Active vendor account
      - Valid store association
      - ProductModel name must be unique per store
      
      **Process:**
      1. Validates vendor permissions
      2. Checks for duplicate SKUs
      3. Creates product record
      4. Initializes inventory
      5. Indexes for search
      
      **Rate Limit:** 100 requests/minute
    `,
        operationId: 'createVendorProduct',
        tags: ['Vendor - Products'],
        deprecated: false,
    })
    @ApiBody({
        type: CreateProductDto,
        description: 'ProductModel creation payload',
        required: true,
        examples: {
            'Simple ProductModel': {
                value: {
                    name: 'Wireless Headphones',
                    slug: 'wireless-headphones',
                    price: 99.99,
                    storeId: 1,
                    sectionId: 5,
                    details: 'High-quality wireless headphones with noise cancellation',
                },
            },
            'ProductModel with Variants': {
                value: {
                    name: 'T-Shirt',
                    slug: 'cotton-t-shirt',
                    price: 29.99,
                    storeId: 1,
                    sectionId: 3,
                    variants: [
                        {
                            sku: 'TS-BLK-S',
                            attributes: { color: 'black', size: 'S' },
                            priceAdjustment: 0,
                        },
                        {
                            sku: 'TS-BLK-M',
                            attributes: { color: 'black', size: 'M' },
                            priceAdjustment: 0,
                        },
                    ],
                },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'ProductModel created successfully',
        type: ApiResponseDto<ProductDetailResponseDto>,
        headers: {
            'X-Request-ID': {
                description: 'Unique request identifier',
                schema: { type: 'string' },
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Validation failed',
        type: ErrorResponseDto,
        content: {
            'application/json': {
                example: {
                    success: false,
                    message: 'Validation failed',
                    data: null,
                    meta: {
                        errors: [
                            { field: 'price', message: 'Price must be greater than 0' },
                            { field: 'slug', message: 'Slug must be unique' },
                        ],
                    },
                },
            },
        },
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden - Insufficient permissions',
        content: {
            'application/json': {
                example: {
                    success: false,
                    message:
                        'You do not have permission to create products in this store',
                    data: null,
                    meta: { errorCode: 'AUTH_1003' },
                },
            },
        },
    })
    @ApiResponse({
        status: 429,
        description: 'Too many requests',
    })
    @ApiBearerAuth()
    @ApiSecurity('jwt')
    @ApiConsumes('application/json')
    @ApiProduces('application/json')
    async create(@Body() dto: CreateProductDto) { }
}
