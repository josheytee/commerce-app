import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { InventoryModel } from 'src/infrastructure';
import {
  OrderRepository,
  VariantRepository,
  InventoryRepository,
} from 'src/infrastructure/database/repositories';
import { StockStatusEnum } from 'src/shared';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(InventoryModel)
    private inventoryModel: typeof InventoryModel,
    private readonly _inventoryRepository: InventoryRepository,
    private readonly _orderRepository: OrderRepository,
    private readonly _variantRepository: VariantRepository,
    private readonly _sequelize: Sequelize,
  ) { }

  async getStock(productId: number) {
    const inventory = await InventoryModel.findOne({
      where: { product_id: productId },
    });

    return {
      quantity: inventory?.quantity ?? 0,
      status: inventory?.stock_status ?? 'out_of_stock',
    };
  }

  async getRepo() {
    return this._inventoryRepository;
  }

  async updateStock(productId: number, quantity: number) {
    return InventoryModel.update(
      { quantity },
      { where: { product_id: productId } },
    );
  }

  async isInStock(productId: number): Promise<boolean> {
    const inventory = await InventoryModel.findOne({
      where: { product_id: productId },
    });
    return (
      inventory?.quantity > 0 &&
      inventory?.stock_status === StockStatusEnum.IN_STOCK
    );
  }

  async reserve(productVariantId: number, storeId: number, qty: number) {
    const inventory = await this._inventoryRepository.findOne({
      where: { product_variant_id: productVariantId, store_id: storeId },
    });

    if (inventory.quantity - inventory.reserved_quantity < qty) {
      throw new Error('Insufficient stock');
    }

    inventory.reserved_quantity += qty;
    await inventory.save();
  }

  async confirm(productVariantId: number, qty: number) {
    const inventory = await this._inventoryRepository.findOne({
      where: { product_variant_id: productVariantId },
    });

    inventory.quantity -= qty;
    inventory.reserved_quantity -= qty;

    await inventory.save();
  }

  // release if payment fails or order is cancelled
  async release(productVariantId: number, storeId: number, qty: number) {
    const inventory = await this._inventoryRepository.findOne({
      where: { product_variant_id: productVariantId, store_id: storeId },
    });

    inventory.reserved_quantity -= qty;

    await inventory.save();
  }

  async getAvailableStock(variantId: number) {
    const inv = await this._inventoryRepository.findOne({
      where: { product_variant_id: variantId },
    });

    return (inv?.quantity ?? 0) - (inv?.reserved_quantity ?? 0);
  }

  async create(data: Partial<InventoryModel>): Promise<InventoryModel> {
    return this.inventoryModel.create(data);
  }

  async findAll(): Promise<InventoryModel[]> {
    return this.inventoryModel.findAll();
  }

  async findOne(id: number): Promise<InventoryModel> {
    const inventory = await this.inventoryModel.findByPk(id);
    if (!inventory) {
      throw new NotFoundException('InventoryModel not found');
    }
    return inventory;
  }

  async update(
    id: number,
    data: Partial<InventoryModel>,
  ): Promise<InventoryModel> {
    const inventory = await this.findOne(id);
    return inventory.update(data);
  }

  async remove(id: number): Promise<void> {
    const inventory = await this.findOne(id);
    await inventory.destroy();
  }
}
