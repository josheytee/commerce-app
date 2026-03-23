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
import { Store } from './models/store.model';

import { JwtAuthGuard } from 'src/account/auth/jwt-auth.guard';
import { Permissions } from 'src/account/permission/permissions.decorator';
import { PermissionsGuard } from 'src/account/permission/permissions.guard';
import { TokenAuthGuard } from 'src/account/auth/token-auth.guard';
import { AuthenticatedRequest } from 'src/account/auth/request/authenticated-request.interface';
import { CreateStoreDto } from './dto';

@Controller('stores')
@UseGuards(TokenAuthGuard, PermissionsGuard)
export class StoreController {
  constructor(private readonly storeService: StoreService) { }

  @Post()
  @Permissions('store:create')
  create(
    @Body() data: Partial<CreateStoreDto>,
    @Req() req: AuthenticatedRequest,
  ): Promise<Store> {

    return this.storeService.create(data);
  }

  @Get()
  @Permissions('store:view')
  findAll(@Req() req: AuthenticatedRequest): Promise<Store[]> {
    const userId = req.user.id;
    return this.storeService.findAllByUserId(userId);
  }

  @Get(':id')
  @Permissions('store:view')
  findOne(@Param('id') id: number): Promise<Store> {
    return this.storeService.findOne(id);
  }

  @Patch(':id')
  @Permissions('store:update')
  update(
    @Param('id') id: number,
    @Body() data: Partial<Store>,
  ): Promise<Store> {
    return this.storeService.update(id, data);
  }

  @Delete(':id')
  @Permissions('store:delete')
  remove(@Param('id') id: number): Promise<void> {
    return this.storeService.remove(id);
  }
}
