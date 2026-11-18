// src/modules/inventory/controllers/inventory.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { InventoryService } from './inventory.service';
import { InventoryModel } from 'src/infrastructure';
// import { AdminJwtGuard } from 'src/shared/guards/admin-jwt.guard';
import {
  CreateInventoryDto,
  UpdateInventoryDto,
  InventoryQueryDto,
  InventoryResponseDto,
  AddStockDto,
  SetStockDto,
} from './dto';

@ApiTags('Admin · Inventory')
@ApiBearerAuth()
// @UseGuards(AdminJwtGuard)
@Controller('admin/inventories')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) { }

  // ============================================================
  // CRUD
  // ============================================================

  @Post()
  @ApiOperation({ summary: 'Create an inventory row (variant at a store)' })
  @ApiCreatedResponse({ type: InventoryResponseDto })
  async create(@Body() dto: CreateInventoryDto): Promise<InventoryModel> {
    return this.inventoryService.create(dto as any);
  }

  @Get()
  @ApiOperation({ summary: 'List inventory rows with filters' })
  @ApiOkResponse({ type: [InventoryResponseDto] })
  async findAll(@Query() query: InventoryQueryDto): Promise<InventoryModel[]> {
    // If you add filtering to the service, pass `query` through.
    return this.inventoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an inventory row by id' })
  @ApiOkResponse({ type: InventoryResponseDto })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<InventoryModel> {
    return this.inventoryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an inventory row' })
  @ApiOkResponse({ type: InventoryResponseDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateInventoryDto,
  ): Promise<InventoryModel> {
    return this.inventoryService.update(id, dto as any);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an inventory row' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.inventoryService.remove(id);
  }

  // ============================================================
  // STOCK OPERATIONS
  // ============================================================

  @Post(':variantId/add')
  @ApiOperation({ summary: 'Add stock to a variant at a store' })
  @ApiOkResponse({ type: InventoryResponseDto })
  async addStock(
    @Param('variantId', ParseIntPipe) variantId: number,
    @Body() dto: AddStockDto,
  ): Promise<InventoryModel> {
    return this.inventoryService.addStock(
      variantId,
      dto.quantity,
      dto.metadata,
    );
  }

  @Post(':variantId/set')
  @ApiOperation({ summary: 'Overwrite stock level for a variant at a store' })
  @ApiOkResponse({ type: InventoryResponseDto })
  async setStock(
    @Param('variantId', ParseIntPipe) variantId: number,
    @Body() dto: SetStockDto,
  ): Promise<InventoryModel> {
    return this.inventoryService.setStockLevel(variantId, dto.quantity);
  }

  @Post(':variantId/recompute-status')
  @ApiOperation({ summary: 'Recompute the denormalized stock_status column' })
  @ApiOkResponse({ schema: { example: { ok: true } } })
  async recompute(
    @Param('variantId', ParseIntPipe) variantId: number,
    @Param('storeId', ParseIntPipe) storeId: number,
  ): Promise<{ ok: true }> {
    await this.inventoryService.recomputeStockStatus(variantId, storeId);
    return { ok: true };
  }
}
