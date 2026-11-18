// src/modules/inventory/controllers/store-inventory.controller.ts
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import {
  VendorRepository,
  StoreRepository,
} from 'src/infrastructure/database/repositories';
import { VendorJwtGuard } from 'src/shared/guards/vendor-jwt.guard';

import {
  AddStockDto,
  SetStockDto,
  VendorStoreInventoryQueryDto,
  InventoryResponseDto,
  StoreInventoryRowDto,
} from './dto';
import { AuthenticatedRequest, requireUserId } from 'src/modules/auth';
import { InventoryService } from './inventory.service';

@ApiTags('Vendor · Inventory')
@ApiBearerAuth()
@UseGuards(VendorJwtGuard)
@ApiParam({ name: 'vendorId', type: Number })
@Controller('vendors/:vendorId/stores/:storeId/inventory')
export class StoreInventoryController {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly vendorRepo: VendorRepository,
    private readonly storeRepo: StoreRepository,
  ) {}

  // ============================================================
  // LIST / READ
  // ============================================================

  @Get()
  @ApiOperation({ summary: 'List inventory rows for a store' })
  @ApiOkResponse({ type: [StoreInventoryRowDto] })
  async list(
    @Req() req: AuthenticatedRequest,
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Param('storeId', ParseIntPipe) storeId: number,
    @Query() query: VendorStoreInventoryQueryDto,
  ): Promise<StoreInventoryRowDto[]> {
    await this.assertOwnsStore(req, vendorId, storeId);
    return this.inventoryService.getStoreInventory(storeId, query);
  }

  @Get('variant/:variantId')
  @ApiOperation({ summary: 'Get inventory for a variant at this store' })
  @ApiOkResponse({ type: InventoryResponseDto })
  async getVariantStock(
    @Req() req: AuthenticatedRequest,
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Param('storeId', ParseIntPipe) storeId: number,
    @Param('variantId', ParseIntPipe) variantId: number,
  ) {
    await this.assertOwnsStore(req, vendorId, storeId);
    return this.inventoryService.getStock(variantId, storeId);
  }

  @Get('variant/:variantId/all-stores')
  @ApiOperation({ summary: "Get a variant's stock across all owned stores" })
  @ApiOkResponse()
  async getVariantAcrossStores(
    @Req() req: AuthenticatedRequest,
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Param('storeId', ParseIntPipe) storeId: number,
    @Param('variantId', ParseIntPipe) variantId: number,
  ) {
    await this.assertOwnsStore(req, vendorId, storeId);
    return this.inventoryService.getVariantStockAcrossAllStores(variantId);
  }

  // ============================================================
  // ADJUSTMENTS
  // ============================================================

  @Post('variant/:variantId/add')
  @ApiOperation({ summary: 'Add stock (restock)' })
  @ApiOkResponse({ type: InventoryResponseDto })
  async addStock(
    @Req() req: AuthenticatedRequest,
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Param('storeId', ParseIntPipe) storeId: number,
    @Param('variantId', ParseIntPipe) variantId: number,
    @Body() dto: AddStockDto,
  ) {
    await this.assertOwnsStore(req, vendorId, storeId);
    return this.inventoryService.addStock(
      variantId,
      dto.quantity,
      dto.metadata,
    );
  }

  @Post('variant/:variantId/set')
  @ApiOperation({ summary: 'Overwrite stock level' })
  @ApiOkResponse({ type: InventoryResponseDto })
  async setStock(
    @Req() req: AuthenticatedRequest,
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Param('storeId', ParseIntPipe) storeId: number,
    @Param('variantId', ParseIntPipe) variantId: number,
    @Body() dto: SetStockDto,
  ) {
    await this.assertOwnsStore(req, vendorId, storeId);
    return this.inventoryService.setStockLevel(variantId, dto.quantity);
  }

  // ============================================================
  // OWNERSHIP
  // ============================================================

  /**
   * Verify the authenticated user owns the vendor and the store belongs
   * to that vendor. Same 404 for both mismatches to prevent enumeration.
   */
  private async assertOwnsStore(
    req: AuthenticatedRequest,
    pathVendorId: number,
    storeId: number,
  ): Promise<void> {
    const userId = requireUserId(req);

    const vendor = await this.vendorRepo.findById(pathVendorId);
    if (!vendor || vendor.user_id !== userId) {
      throw new NotFoundException('Vendor not found');
    }

    const store = await this.storeRepo.findById(storeId);
    if (!store || store.vendor_id !== pathVendorId) {
      throw new NotFoundException('Store not found');
    }
  }
}
