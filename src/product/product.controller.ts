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
import { Product } from './product.model';

import { JwtAuthGuard } from 'src/account/auth/jwt-auth.guard';
import { Permissions } from 'src/account/permission/permissions.decorator';
import { PermissionsGuard } from 'src/account/permission/permissions.guard';
import { ApiSuccessResponse } from 'src/api.response';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Products')
@Controller('products')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @ApiSuccessResponse(Product)
  @Permissions('product:create')
  create(@Body() data: Partial<Product>): Promise<Product> {
    return this.productService.create(data);
  }

  @Get('search')
  @ApiSuccessResponse(Product)
  async searchByAttributes(
    @Query('attributes') attributes: { attributeId: number; value: string }[],
  ) {
    return this.productService.searchProductsByAttributes(attributes);
  }

  @Get()
  @ApiSuccessResponse(Product)
  @Permissions('product:view')
  findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get(':id')
  @Permissions('product:view')
  @ApiSuccessResponse(Product)
  findOne(@Param('id') id: number): Promise<Product> {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @ApiSuccessResponse(Product)
  @Permissions('product:update')
  update(
    @Param('id') id: number,
    @Body() data: Partial<Product>,
  ): Promise<Product> {
    return this.productService.update(id, data);
  }

  @Delete(':id')
  @ApiSuccessResponse(Product)
  @Permissions('product:delete')
  remove(@Param('id') id: number): Promise<void> {
    return this.productService.remove(id);
  }
}
