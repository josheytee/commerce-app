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
  ParseIntPipe,
} from '@nestjs/common';
import { StoreService } from './store.service';

import { TokenAuthGuard } from 'src/modules/auth/token-auth.guard';
import { AuthenticatedRequest } from 'src/modules/auth/interfaces/authenticated-request.interface';
import { CreateStoreDto, UpdateStoreDto } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiSuccessResponse } from 'src/shared/dto/common/api.response';
import { PermissionsGuard } from 'src/modules/user/permission/permissions.guard';
import { Permissions } from 'src/modules/user/permission/permissions.decorator';
import { ProductModel, StoreModel } from 'src/infrastructure';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import { ProductService } from '../products/services';

@ApiBearerAuth()
@ApiTags('Vendor - Stores')
@Controller('vendors/:vendorId/stores')
@UseGuards(TokenAuthGuard, PermissionsGuard)
export class StoreController {
  constructor(
    private readonly storeService: StoreService,
    private readonly productService: ProductService,
  ) { }

  @Post()
  @Permissions('store:create')
  @ApiSuccessResponse(StoreModel)
  create(
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Body() data: CreateStoreDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<StoreModel> {
    return this.storeService.create({
      ...data,
      vendor_id: vendorId,
    });
  }

  @Get()
  @Permissions('store:view')
  @ApiSuccessResponse(StoreModel)
  @Public()
  findAll(
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<StoreModel[]> {
    return this.storeService.findAllByVendorId(vendorId);
  }

  @Get(':id')
  @Permissions('store:view')
  @Public()
  @ApiSuccessResponse(StoreModel)
  findOne(
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Param('id', ParseIntPipe) storeId: number,
  ): Promise<StoreModel> {
    return this.storeService.findOneByVendorId(vendorId, storeId);
  }

  @Get(':id/products')
  @Permissions('store:view')
  @Public()
  @ApiSuccessResponse(ProductModel)
  async findOneProducts(
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Param('id', ParseIntPipe) storeId: number,
  ): Promise<ProductModel[]> {
    return (await this.productService.findAllByStore(storeId)).rows;
  }

  @Patch(':id')
  @Permissions('store:update')
  @ApiSuccessResponse(StoreModel)
  update(
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Param('id', ParseIntPipe) storeId: number,
    @Body() data: UpdateStoreDto,
  ): Promise<StoreModel> {
    console.log('Updating store with data:', { vendorId, storeId, data });
    return this.storeService.updateByVendor(vendorId, storeId, data);
  }

  @Delete(':id')
  @Permissions('store:delete')
  @ApiSuccessResponse(StoreModel)
  remove(
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Param('id', ParseIntPipe) storeId: number,
  ): Promise<void> {
    return this.storeService.removeByVendorId(vendorId, storeId);
  }
}
