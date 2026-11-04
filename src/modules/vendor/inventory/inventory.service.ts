// src/modules/inventory/inventory.service.ts
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';

import { InventoryModel, ProductVariantModel } from 'src/infrastructure';
import {
  InventoryRepository,
  VariantRepository,
  OrderRepository,
} from 'src/infrastructure/database/repositories';
import { StockStatusEnum } from 'src/shared';

// ============================================================
// INVENTORY SERVICE
// ============================================================
// Source of truth: InventoryModel
//   - quantity          = physically on hand at a store
//   - reserved_quantity = soft hold for pending carts/orders
//   - available_quantity = quantity - reserved_quantity (DB-generated)
//   - stock_status      = derived by @BeforeSave hook on the model
//
// "Store" is the fulfillment location for now. When LocationModel is
// introduced, store_id here becomes location_id — a 1-line migration.
// ============================================================

const LOW_STOCK_MULTIPLIER = 1; // threshold factor — adjust as needed

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);

  constructor(
    @InjectModel(InventoryModel)
    private readonly inventoryModel: typeof InventoryModel,
    private readonly inventoryRepo: InventoryRepository,
    private readonly variantRepo: VariantRepository,
    private readonly orderRepo: OrderRepository,
    private readonly sequelize: Sequelize,
  ) { }

  // ============================================================
  // STOCK QUERIES
  // ============================================================

  /**
   * Stock for a variant at a specific store.
   */
  async getStock(variantId: number, storeId: number) {
    const inventory = await this.inventoryRepo.findOne({
      where: { variant_id: variantId, store_id: storeId },
      include: ['variant', 'store'],
    });

    if (!inventory) {
      return {
        quantity: 0,
        reserved: 0,
        available: 0,
        status: StockStatusEnum.OUT_OF_STOCK,
        store_id: storeId,
        variant_id: variantId,
      };
    }

    return {
      quantity: Number(inventory.quantity),
      reserved: Number(inventory.reserved_quantity),
      available: Number(inventory.available_quantity),
      status: inventory.stock_status,
      store_id: inventory.store_id,
      store_name: (inventory as any).store?.name,
      variant_id: inventory.variant_id,
      low_stock_threshold: Number(inventory.low_stock_threshold),
      allow_backorders: inventory.allow_backorders,
      track_quantity: inventory.track_quantity,
    };
  }

  /**
   * Stock for a single variant across all stores.
   */
  async getVariantStockAcrossAllStores(variantId: number) {
    const rows = await this.inventoryRepo.findAll({
      where: { variant_id: variantId },
      include: ['store'],
    });

    if (!rows.length) {
      return {
        variant_id: variantId,
        total_quantity: 0,
        total_reserved: 0,
        total_available: 0,
        stores: [],
        status: StockStatusEnum.OUT_OF_STOCK,
      };
    }

    const stores = rows.map((row) => ({
      store_id: row.store_id,
      store_name: (row as any).store?.name,
      quantity: Number(row.quantity),
      reserved: Number(row.reserved_quantity),
      available: Number(row.available_quantity),
      stock_status: row.stock_status,
      allow_backorders: row.allow_backorders,
    }));

    const totalQuantity = rows.reduce((sum, r) => sum + Number(r.quantity), 0);
    const totalReserved = rows.reduce(
      (sum, r) => sum + Number(r.reserved_quantity),
      0,
    );
    const totalAvailable = totalQuantity - totalReserved;
    const allowAnyBackorder = rows.some((r) => r.allow_backorders);

    return {
      variant_id: variantId,
      total_quantity: totalQuantity,
      total_reserved: totalReserved,
      total_available: totalAvailable,
      stores,
      status: this.deriveAggregateStatus(totalAvailable, allowAnyBackorder),
    };
  }

  /**
   * Stock for all variants of a product across all stores.
   * This is what `ProductService.getProductDetails` calls.
   */
  async getStockAcrossAllStores(productId: number) {
    return this.getProductStock(productId);
  }

  async getProductStock(productId: number) {
    const variants = await this.variantRepo.findAll({
      where: { product_id: productId },
      include: [
        {
          model: InventoryModel,
          as: 'inventories',
          include: ['store'],
        },
      ],
    });

    if (!variants.length) {
      return {
        product_id: productId,
        total_quantity: 0,
        total_available: 0,
        variants: [],
        status: StockStatusEnum.OUT_OF_STOCK,
        has_variants: false,
      };
    }

    const variantData = variants.map((variant) => {
      const invs = (variant as any).inventories ?? [];
      const totalQuantity = invs.reduce(
        (sum: number, i: any) => sum + Number(i.quantity),
        0,
      );
      const totalReserved = invs.reduce(
        (sum: number, i: any) => sum + Number(i.reserved_quantity),
        0,
      );
      const totalAvailable = totalQuantity - totalReserved;
      const allowAnyBackorder = invs.some((i: any) => i.allow_backorders);

      return {
        variant_id: variant.id,
        variant_name: variant.variant_name,
        sku: variant.sku,
        price: Number(variant.price),
        total_quantity: totalQuantity,
        total_reserved: totalReserved,
        total_available: totalAvailable,
        status: this.deriveAggregateStatus(totalAvailable, allowAnyBackorder),
        stores: invs.map((i: any) => ({
          store_id: i.store_id,
          store_name: i.store?.name,
          quantity: Number(i.quantity),
          reserved: Number(i.reserved_quantity),
          available: Number(i.available_quantity),
          stock_status: i.stock_status,
        })),
      };
    });

    const totalQuantity = variantData.reduce(
      (sum, v) => sum + v.total_quantity,
      0,
    );
    const totalAvailable = variantData.reduce(
      (sum, v) => sum + v.total_available,
      0,
    );
    const allowAnyBackorder = variantData.some((v) =>
      variants
        .find((x) => x.id === v.variant_id)
        ?.inventories?.some((i: any) => i.allow_backorders),
    );

    return {
      product_id: productId,
      total_quantity: totalQuantity,
      total_available: totalAvailable,
      variants: variantData,
      status: this.deriveAggregateStatus(totalAvailable, allowAnyBackorder),
      has_variants: variants.length > 1,
    };
  }

  /**
   * Available stock for a variant at a specific store.
   */
  async getAvailableStock(variantId: number, storeId: number): Promise<number> {
    const inv = await this.inventoryRepo.findOne({
      where: { variant_id: variantId, store_id: storeId },
      attributes: ['available_quantity'],
    });
    if (!inv) return 0;
    return Number(inv.available_quantity);
  }

  /**
   * Total available stock for a variant across all stores.
   */
  async getTotalAvailableStock(variantId: number): Promise<number> {
    const rows = await this.inventoryRepo.findAll({
      where: { variant_id: variantId },
      attributes: ['available_quantity'],
    });
    return rows.reduce((sum, r) => sum + Number(r.available_quantity), 0);
  }

  /**
   * Is the variant in stock at a store, for a given quantity?
   */
  async isInStock(
    variantId: number,
    storeId: number,
    quantity: number = 1,
  ): Promise<boolean> {
    const inv = await this.inventoryRepo.findOne({
      where: { variant_id: variantId, store_id: storeId },
    });

    if (!inv) return false;

    const available = Number(inv.available_quantity);
    if (available >= quantity) return true;
    return inv.allow_backorders === true;
  }

  /**
   * Pick the best store to fulfill a variant for a given quantity.
   *
   * Current heuristic:
   *   1. Stores with sufficient available stock
   *   2. Prefer the primary store (if flagged)
   *   3. Prefer more available stock
   *   4. Fall back to any store that allows backorders
   *
   * When LocationModel lands, distance to the customer can be added here.
   */
  async getBestFulfillmentStore(
    variantId: number,
    quantity: number,
    _customerLat?: number,
    _customerLng?: number,
  ): Promise<{ store_id: number; available: number } | null> {
    const rows = await this.inventoryRepo.findAll({
      where: { variant_id: variantId },
      include: ['store'],
    });

    if (!rows.length) return null;

    const candidates = rows
      .map((r) => ({
        store_id: r.store_id,
        available: Number(r.available_quantity),
        allow_backorders: r.allow_backorders,
        // `is_primary` doesn't exist on InventoryModel today; if you add it,
        // wire it here. For now, prefer stores with sufficient stock.
      }))
      .filter((c) => c.available >= quantity)
      .sort((a, b) => b.available - a.available);

    if (candidates.length) {
      return {
        store_id: candidates[0].store_id,
        available: candidates[0].available,
      };
    }

    // No store has enough on hand; fall back to a backorder-capable one.
    const backorderStore = rows.find((r) => r.allow_backorders === true);
    if (backorderStore) {
      return {
        store_id: backorderStore.store_id,
        available: Number(backorderStore.available_quantity),
      };
    }

    return null;
  }

  // ============================================================
  // STOCK OPERATIONS
  // ============================================================

  /**
   * Reserve stock for a variant at a store.
   *
   * Increments `reserved_quantity` and re-saves the row so the
   * `@BeforeSave` hook on InventoryModel recomputes `stock_status`.
   *
   * Must be called inside a transaction with a `LOCK.UPDATE` on the row.
   */
  async reserve(
    variantId: number,
    storeId: number,
    quantity: number,
    transaction?: Transaction,
  ): Promise<InventoryModel> {
    if (quantity <= 0) throw new BadRequestException('Quantity must be positive');

    const inv = await this.inventoryRepo.findOne({
      where: { variant_id: variantId, store_id: storeId },
      lock: transaction ? Transaction.LOCK.UPDATE : undefined,
      transaction,
    });

    if (!inv) {
      throw new BadRequestException(
        `No inventory row for variant ${variantId} at store ${storeId}`,
      );
    }

    const available = Number(inv.available_quantity);

    if (available < quantity && !inv.allow_backorders) {
      throw new BadRequestException(
        `Insufficient stock. Available: ${available}, Requested: ${quantity}`,
      );
    }

    await inv.update(
      { reserved_quantity: Number(inv.reserved_quantity) + quantity },
      { transaction },
    );

    return inv; // ← NEW: caller needs the id
  }

  /**
   * Confirm a reservation — after payment succeeds.
   *
   * Decrements `quantity` and `reserved_quantity` together, so
   * `available_quantity` stays the same (the hold becomes a real deduction).
   */
  async confirm(
    variantId: number,
    storeId: number,
    quantity: number,
    transaction?: Transaction,
  ): Promise<void> {
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be positive');
    }

    const inv = await this.inventoryRepo.findOne({
      where: { variant_id: variantId, store_id: storeId },
      lock: transaction ? Transaction.LOCK.UPDATE : undefined,
      transaction,
    });

    if (!inv) {
      throw new NotFoundException(
        `No inventory row for variant ${variantId} at store ${storeId}`,
      );
    }

    if (Number(inv.reserved_quantity) < quantity) {
      throw new BadRequestException(
        `Cannot confirm ${quantity} units. Only ${inv.reserved_quantity} reserved.`,
      );
    }

    const newQuantity = Number(inv.quantity) - quantity;
    if (newQuantity < 0) {
      throw new BadRequestException(
        `Stock would go negative for variant ${variantId}`,
      );
    }

    await inv.update(
      {
        quantity: newQuantity,
        reserved_quantity: Number(inv.reserved_quantity) - quantity,
      },
      { transaction },
    );
  }

  /**
   * Release a reservation — payment failed, order cancelled, or TTL expired.
   *
   * Decrements `reserved_quantity` only; `quantity` is untouched.
   */
  async release(
    variantId: number,
    storeId: number,
    quantity: number,
    transaction?: Transaction,
  ): Promise<void> {
    if (quantity <= 0) return;

    const inv = await this.inventoryRepo.findOne({
      where: { variant_id: variantId, store_id: storeId },
      lock: transaction ? Transaction.LOCK.UPDATE : undefined,
      transaction,
    });

    if (!inv) {
      throw new NotFoundException(
        `No inventory row for variant ${variantId} at store ${storeId}`,
      );
    }

    const reserved = Number(inv.reserved_quantity);
    if (reserved < quantity) {
      // Be forgiving — sometimes a confirm already consumed the hold
      this.logger.warn(
        `Release called for ${quantity} but only ${reserved} reserved for variant ${variantId} at store ${storeId}`,
      );
      await inv.update({ reserved_quantity: 0 }, { transaction });
      return;
    }

    await inv.update(
      { reserved_quantity: reserved - quantity },
      { transaction },
    );
  }

  /**
   * Bulk reserve. Runs all reservations in one transaction.
   */
  async bulkReserve(
    items: Array<{ variantId: number; storeId: number; quantity: number }>,
  ): Promise<void> {
    await this.sequelize.transaction(async (t) => {
      for (const item of items) {
        await this.reserve(item.variantId, item.storeId, item.quantity, t);
      }
    });
  }

  /**
   * Bulk confirm. Runs all confirmations in one transaction.
   */
  async bulkConfirm(
    items: Array<{ variantId: number; storeId: number; quantity: number }>,
  ): Promise<void> {
    await this.sequelize.transaction(async (t) => {
      for (const item of items) {
        await this.confirm(item.variantId, item.storeId, item.quantity, t);
      }
    });
  }

  /**
   * Add stock (restock / initial add).
   */
  async addStock(
    variantId: number,
    storeId: number,
    quantity: number,
    metadata?: Record<string, any>,
    transaction?: Transaction,
  ): Promise<InventoryModel> {
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be positive');
    }

    // findOrCreate already creates the row if missing (with quantity = 0)
    const [inv, created] = await this.inventoryRepo.findOrCreateForVariant(
      variantId,
      storeId,
      0,
      transaction,
    );

    // Merge metadata only if the caller provided some
    const mergedMetadata = '';
    // metadata !== undefined
    //   ? { ...(inv.metadata ?? {}), ...metadata }
    //   : inv.metadata;

    // ✅ update() writes fields + fires the @BeforeSave hook (recomputes stock_status)
    await inv.update(
      {
        quantity: Number(inv.quantity) + quantity,
        ...(metadata !== undefined ? { metadata: mergedMetadata } : {}),
      },
      { transaction },
    );

    this.logger.log(
      `Added ${quantity} to variant ${variantId} at store ${storeId} (created=${created}, new_qty=${inv.quantity})`,
    );

    return inv;
  }
  /**
   * Overwrite stock level.
   */
  async setStockLevel(
    variantId: number,
    storeId: number,
    quantity: number,
    transaction?: Transaction,
  ): Promise<InventoryModel> {
    if (quantity < 0) {
      throw new BadRequestException('Quantity cannot be negative');
    }

    const [inv] = await this.inventoryRepo.findOrCreateForVariant(
      variantId,
      storeId,
      0,
      transaction,
    );

    await inv.update({ quantity }, { transaction });
    return inv;
  }

  // ============================================================
  // STORE MANAGEMENT
  // ============================================================

  /**
   * Stores that currently have enough stock for a variant.
   */
  async getStoresWithStock(
    variantId: number,
    quantity: number = 1,
  ): Promise<any[]> {
    const rows = await this.inventoryRepo.findAll({
      where: { variant_id: variantId },
      include: ['store'],
    });

    return rows
      .filter((r) => Number(r.available_quantity) >= quantity)
      .map((r) => ({
        store_id: r.store_id,
        store_name: (r as any).store?.name,
        quantity: Number(r.quantity),
        reserved_quantity: Number(r.reserved_quantity),
        available: Number(r.available_quantity),
        stock_status: r.stock_status,
        allow_backorders: r.allow_backorders,
      }));
  }

  // ============================================================
  // UTILITIES
  // ============================================================

  /**
   * Aggregate status across multiple inventory rows.
   */
  private deriveAggregateStatus(
    totalAvailable: number,
    allowBackorders: boolean,
  ): StockStatusEnum {
    if (totalAvailable > 0) return StockStatusEnum.IN_STOCK;
    if (allowBackorders) return StockStatusEnum.BACKORDER;
    return StockStatusEnum.OUT_OF_STOCK;
  }

  /**
   * Recompute stock_status for a single inventory row.
   * Normally the @BeforeSave hook handles this — exposed for manual repair.
   */
  async recomputeStockStatus(
    variantId: number,
    storeId: number,
  ): Promise<void> {
    const inv = await this.inventoryRepo.findOne({
      where: { variant_id: variantId, store_id: storeId },
    });
    if (!inv) return;

    const available = Number(inv.quantity) - Number(inv.reserved_quantity);
    let status: StockStatusEnum;

    if (!inv.track_quantity) {
      status = StockStatusEnum.IN_STOCK;
    } else if (available > Number(inv.low_stock_threshold)) {
      status = StockStatusEnum.IN_STOCK;
    } else if (available > 0) {
      status = StockStatusEnum.LOW_STOCK;
    } else if (inv.allow_backorders) {
      status = StockStatusEnum.BACKORDER;
    } else {
      status = StockStatusEnum.OUT_OF_STOCK;
    }

    if (inv.stock_status !== status) {
      await inv.update({ stock_status: status });
    }
  }

  // ============================================================
  // CRUD
  // ============================================================

  async create(data: Partial<InventoryModel>): Promise<InventoryModel> {
    return this.inventoryModel.create(data as any);
  }

  async findAll(): Promise<InventoryModel[]> {
    return this.inventoryModel.findAll({ include: ['variant', 'store'] });
  }

  async findOne(id: number): Promise<InventoryModel> {
    const row = await this.inventoryModel.findByPk(id, {
      include: ['variant', 'store'],
    });
    if (!row) throw new NotFoundException('Inventory not found');
    return row;
  }

  async update(
    id: number,
    data: Partial<InventoryModel>,
  ): Promise<InventoryModel> {
    const row = await this.findOne(id);
    return row.update(data);
  }

  async remove(id: number): Promise<void> {
    const row = await this.findOne(id);
    await row.destroy();
  }

  // src/modules/inventory/inventory.service.ts

  async getStoreInventory(
    storeId: number,
    query: {
      search?: string;
      stock_status?: StockStatusEnum;
      low_stock_only?: boolean;
      page?: number;
      limit?: number;
    } = {},
  ): Promise<
    Array<{
      inventory_id: number;
      variant_id: number;
      variant_name?: string;
      sku: string;
      product_name?: string;
      quantity: number;
      reserved_quantity: number;
      available_quantity: number;
      stock_status: StockStatusEnum;
      allow_backorders: boolean;
      low_stock_threshold: number;
      updated_at?: Date;
    }>
  > {
    const { Op } = await import('sequelize');

    const where: any = { store_id: storeId };

    if (query.stock_status) {
      where.stock_status = query.stock_status;
    }
    if (query.low_stock_only) {
      where.stock_status = {
        [Op.in]: [StockStatusEnum.LOW_STOCK, StockStatusEnum.OUT_OF_STOCK],
      };
    }

    const variantWhere: any = {};
    if (query.search) {
      variantWhere[Op.or as any] = [
        { sku: { [Op.iLike]: `%${query.search}%` } },
        { variant_name: { [Op.iLike]: `%${query.search}%` } },
      ];
    }

    const rows = await this.inventoryRepo.findAll({
      where,
      include: [
        {
          model: ProductVariantModel,
          as: 'variant',
          required: true,
          where: Object.keys(variantWhere).length ? variantWhere : undefined,
          include: [{ association: 'product' }],
        },
      ],
      order: [['updated_at', 'DESC']],
      limit: query.limit ?? 50,
      offset: ((query.page ?? 1) - 1) * (query.limit ?? 50),
    });

    return rows.map((row) => {
      const variant = (row as any).variant;
      const product = variant?.product;
      return {
        inventory_id: row.id,
        variant_id: row.variant_id,
        variant_name: variant?.variant_name,
        sku: variant?.sku,
        product_name: product?.name,
        quantity: Number(row.quantity),
        reserved_quantity: Number(row.reserved_quantity),
        available_quantity: Number(row.available_quantity),
        stock_status: row.stock_status,
        allow_backorders: row.allow_backorders,
        low_stock_threshold: Number(row.low_stock_threshold),
        updated_at: (row as any).updated_at,
      };
    });
  }

  // ============================================================
  // REPOSITORY ACCESS
  // ============================================================

  getRepository(): InventoryRepository {
    return this.inventoryRepo;
  }
}
