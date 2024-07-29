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
import { RolesGuard } from 'src/account/role/roles.guard';
import { Roles } from 'src/account/role/roles.decorator';

@Controller('stores')
@UseGuards(RolesGuard)
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  create(@Body() data: Partial<Store>): Promise<Store> {
    return this.storeService.create(data);
  }

  @Get()
  @Roles('Admin', 'Vendor')
  findAll(): Promise<Store[]> {
    return this.storeService.findAll();
  }

  @Get(':id')
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
