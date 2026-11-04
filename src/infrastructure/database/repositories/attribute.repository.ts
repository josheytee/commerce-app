// src/infrastructure/database/repositories/attribute.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction } from 'sequelize';
import { BaseRepository } from './base.repository';
import { AttributeModel } from '../models';

@Injectable()
export class AttributeRepository extends BaseRepository<AttributeModel> {
    constructor(
        @InjectModel(AttributeModel)
        private readonly attributeModel: typeof AttributeModel,
    ) {
        super(attributeModel);
    }

    async findByIds(ids: number[], t?: Transaction): Promise<AttributeModel[]> {
        if (!ids.length) return [];
        return this.attributeModel.findAll({
            where: { id: { [Op.in]: ids } },
            transaction: t,
        });
    }

    async listForVendor(
        vendorId: number,
        t?: Transaction,
    ): Promise<AttributeModel[]> {
        return this.attributeModel.findAll({
            where: {
                [Op.or]: [{ vendor_id: null }, { vendor_id: vendorId }],
            },
            transaction: t,
        });
    }

    async findAndCountAll(options: {
        where?: any;
        limit?: number;
        offset?: number;
        order?: any[];
        include?: any[];
    }): Promise<{ rows: AttributeModel[]; count: number }> {
        return this.model.findAndCountAll({
            where: options.where,
            limit: options.limit,
            offset: options.offset,
            order: options.order,
            include: options.include,
            distinct: true,
        });
    }
}
