import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductService } from './services/product.service';
import { ProductModel } from 'src/infrastructure';

import { ApiSuccessResponse } from 'src/shared/dto/common/api.response';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PermissionsGuard } from 'src/modules/user/permission/permissions.guard';
import { Permissions } from 'src/modules/user/permission/permissions.decorator';
import { CreateProductWithVariantsDto, UpdateProductDto } from './dto';
import { TokenAuthGuard } from 'src/modules/auth/token-auth.guard';

@ApiTags('Vendor - Products')
@Controller('vendors/:vendorId/products')
@ApiBearerAuth()
@UseGuards(TokenAuthGuard, PermissionsGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @ApiSuccessResponse(ProductModel)
  @Permissions('product:create')
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
  // @ApiBody({
  //   type: CreateProductDto,
  //   description: 'ProductModel creation payload',
  //   required: true,
  //   examples: {
  //     'Simple ProductModel': {
  //       value: {
  //         name: 'Wireless Headphones',
  //         slug: 'wireless-headphones',
  //         price: 99.99,
  //         storeId: 1,
  //         sectionId: 5,
  //         details: 'High-quality wireless headphones with noise cancellation',
  //       },
  //     },
  //     'ProductModel with Variants': {
  //       value: {
  //         name: 'T-Shirt',
  //         slug: 'cotton-t-shirt',
  //         price: 29.99,
  //         storeId: 1,
  //         sectionId: 3,
  //         variants: [
  //           {
  //             sku: 'TS-BLK-S',
  //             attributes: { color: 'black', size: 'S' },
  //             priceAdjustment: 0,
  //           },
  //           {
  //             sku: 'TS-BLK-M',
  //             attributes: { color: 'black', size: 'M' },
  //             priceAdjustment: 0,
  //           },
  //         ],
  //       },
  //     },
  //   },
  // })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    // type: ApiResponseDto<ProductDetailResponseDto>,
    headers: {
      'X-Request-ID': {
        description: 'Unique request identifier',
        schema: { type: 'string' },
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
  @ApiConsumes('application/json')
  @ApiProduces('application/json')
  create(
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Body() data: CreateProductWithVariantsDto,
  ): Promise<ProductModel> {
    return this.productService.create({ ...data, vendor_id: vendorId });
  }

  @Get('search')
  @ApiSuccessResponse(ProductModel)
  async searchByAttributes(
    @Query('attributes') attributes: { attributeId: number; value: string }[],
  ) {
    return this.productService.searchProductsByAttributes(attributes);
  }

  @Get()
  @ApiSuccessResponse(ProductModel)
  @Permissions('product:view')
  async findAll(@Param('vendorId', ParseIntPipe) vendorId: number) {
    const data = await this.productService.findAllByVendor(vendorId);

    return {
      items: data.rows,

      meta: {
        count: data.rows.length,
      },
    };
  }

  @Get(':id')
  @Permissions('product:view')
  @ApiSuccessResponse(ProductModel)
  findOne(
    @Param('id') id: number,
    @Param('vendorId', ParseIntPipe) vendorId: number,
  ): Promise<ProductModel> {
    return this.productService.findOneByVendor(vendorId, id);
  }

  @Patch(':id')
  @ApiSuccessResponse(ProductModel)
  @Permissions('product:update')
  update(
    @Param('id') id: number,
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Body() data: UpdateProductDto,
  ): Promise<ProductModel> {
    return this.productService.update(vendorId, id, data);
  }

  @Delete(':id')
  @ApiSuccessResponse(ProductModel)
  @Permissions('product:delete')
  remove(@Param('id') id: number): Promise<void> {
    return this.productService.remove(id);
  }
}
