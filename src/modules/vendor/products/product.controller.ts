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
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductModel } from 'src/infrastructure';

import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';

import { ApiSuccessResponse } from 'src/shared/dto/common/api.response';
import { ApiTags } from '@nestjs/swagger';
import { PermissionsGuard } from 'src/modules/user/permission/permissions.guard';
import { Permissions } from 'src/modules/user/permission/permissions.decorator';

@ApiTags('Vendor - Products')
@Controller('vendors/products')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @ApiSuccessResponse(ProductModel)
  @Permissions('product:create')
  create(@Body() data: Partial<ProductModel>): Promise<ProductModel> {
    return this.productService.create(data);
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
  findAll(): Promise<ProductModel[]> {
    return this.productService.findAll();
  }

  @Get(':id')
  @Permissions('product:view')
  @ApiSuccessResponse(ProductModel)
  findOne(@Param('id') id: number): Promise<ProductModel> {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @ApiSuccessResponse(ProductModel)
  @Permissions('product:update')
  update(
    @Param('id') id: number,
    @Body() data: Partial<ProductModel>,
  ): Promise<ProductModel> {
    return this.productService.update(id, data);
  }

  @Delete(':id')
  @ApiSuccessResponse(ProductModel)
  @Permissions('product:delete')
  remove(@Param('id') id: number): Promise<void> {
    return this.productService.remove(id);
  }
}
