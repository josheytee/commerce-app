import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { Store } from './models/store.model';

import { JwtAuthGuard } from 'src/account/auth/jwt-auth.guard';
import { Permissions } from 'src/account/permission/permissions.decorator';
import { PermissionsGuard } from 'src/account/permission/permissions.guard';

@Controller('stores')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  @Permissions('create-role')
  create(@Body() data: Partial<Store>): Promise<Store> {
    return this.storeService.create(data);
  }

  @Get()
  @Permissions('view_store')
  findAll(): Promise<Store[]> {
    return this.storeService.findAll();
  }

  @Get(':id')
  @Permissions('view_store')
  findOne(@Param('id') id: number): Promise<Store> {
    return this.storeService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() data: Partial<Store>,
  ): Promise<Store> {
    return this.storeService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.storeService.remove(id);
  }
}
