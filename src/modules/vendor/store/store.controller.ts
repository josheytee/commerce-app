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
} from '@nestjs/common';
import { StoreService } from './store.service';

import { TokenAuthGuard } from 'src/modules/auth/token-auth.guard';
import { AuthenticatedRequest } from 'src/modules/auth/interfaces/authenticated-request.interface';
import { CreateStoreDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiSuccessResponse } from 'src/api.response';
import { PermissionsGuard } from 'src/modules/user/permission/permissions.guard';
import { Permissions } from 'src/modules/user/permission/permissions.decorator';
import { StoreModel } from 'src/infrastructure';

@Controller('stores')
@ApiTags('Stores')
@UseGuards(TokenAuthGuard, PermissionsGuard)
export class StoreController {
  constructor(private readonly storeService: StoreService) { }

  @Post()
  @Permissions('store:create')
  @ApiSuccessResponse(StoreModel)
  create(
    @Body() data: Partial<CreateStoreDto>,
    @Req() req: AuthenticatedRequest,
  ): Promise<StoreModel> {

    return this.storeService.create(data);
  }

  @Get()
  @Permissions('store:view')
  @ApiSuccessResponse(StoreModel)
  findAll(@Req() req: AuthenticatedRequest): Promise<StoreModel[]> {
    const userId = req.user.id;
    return this.storeService.findAllByUserId(userId);
  }

  @Get(':id')
  @Permissions('store:view')
  @ApiSuccessResponse(StoreModel)
  findOne(@Param('id') id: number): Promise<StoreModel> {
    return this.storeService.findOne(id);
  }

  @Patch(':id')
  @Permissions('store:update')
  @ApiSuccessResponse(StoreModel)
  update(
    @Param('id') id: number,
    @Body() data: Partial<StoreModel>,
  ): Promise<StoreModel> {
    return this.storeService.update(id, data);
  }

  @Delete(':id')
  @Permissions('store:delete')
  @ApiSuccessResponse(StoreModel)
  remove(@Param('id') id: number): Promise<void> {
    return this.storeService.remove(id);
  }
}
