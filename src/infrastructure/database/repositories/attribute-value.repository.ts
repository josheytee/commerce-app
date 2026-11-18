// src/infrastructure/database/repositories/attribute.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction } from 'sequelize';
import { BaseRepository } from './base.repository';
import { AttributeValueModel } from '../models';

@Injectable()
export class AttributeValueRepository extends BaseRepository<AttributeValueModel> {
    constructor(
        @InjectModel(AttributeValueModel)
        private readonly attributeValueModel: typeof AttributeValueModel,
    ) {
        super(attributeValueModel);
    }

    async findByIds(
        ids: number[],
        t?: Transaction,
    ): Promise<AttributeValueModel[]> {
        if (!ids.length) return [];
        return this.attributeValueModel.findAll({
            where: { id: { [Op.in]: ids } },
            transaction: t,
        });
    }

    async findOneByValue(
        attributeId: number,
        value: string,
        t?: Transaction,
    ): Promise<AttributeValueModel | null> {
        return this.model.findOne({
            where: { attribute_id: attributeId, value },
            transaction: t,
        });
    }
}
