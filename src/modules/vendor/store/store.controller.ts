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
import { StoreModel } from 'src/infrastructure';

@ApiBearerAuth()
@ApiTags('Vendor - Stores')
@Controller('vendors/:vendorId/stores')
@UseGuards(TokenAuthGuard, PermissionsGuard)
export class StoreController {
  constructor(private readonly storeService: StoreService) { }

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
  findAll(
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<StoreModel[]> {
    return this.storeService.findAllByVendorId(vendorId);
  }

  @Get(':id')
  @Permissions('store:view')
  @ApiSuccessResponse(StoreModel)
  findOne(
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Param('storeId', ParseIntPipe) storeId: number,
  ): Promise<StoreModel> {
    return this.storeService.findOneByVendorId(vendorId, storeId);
  }

  @Patch(':id')
  @Permissions('store:update')
  @ApiSuccessResponse(StoreModel)
  update(
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Param('storeId', ParseIntPipe) storeId: number,
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
    @Param('storeId', ParseIntPipe) storeId: number,
  ): Promise<void> {
    return this.storeService.removeByVendorId(vendorId, storeId);
  }
}
