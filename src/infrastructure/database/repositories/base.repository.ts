// repositories/base.repository.ts
import {
    Model,
    ModelCtor,
    Transaction,
    WhereOptions,
    FindOptions,
} from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';

export abstract class BaseRepository<T extends Model> {
    constructor(protected readonly model: ModelCtor<T>) { }

    async create(data: Partial<T>): Promise<T> {
        return this.model.create(data as any);
    }

    async findById(id: number, options?: FindOptions): Promise<T | null> {
        return this.model.findByPk(id, options);
    }

    async findOne(options: FindOptions): Promise<T | null> {
        return this.model.findOne(options);
    }

    async findAll(options?: FindOptions): Promise<T[]> {
        return this.model.findAll(options);
    }

    async update(id: number, data: Partial<T>): Promise<[number, T[]]> {
        return this.model.update(data as any, {
            where: { id } as WhereOptions,
            returning: true,
        });
    }

    async delete(id: number): Promise<number> {
        return this.model.destroy({ where: { id } as WhereOptions });
    }

    async bulkCreate(data: Partial<T>[]): Promise<T[]> {
        return this.model.bulkCreate(data as any);
    }

    async createWithTransaction(
        data: Partial<T>,
        transaction: Transaction,
    ): Promise<T> {
        return this.model.create(data as any, { transaction });
    }
    async bulkCreateWithTransaction(
        data: Partial<T>[],
        transaction: Transaction,
    ): Promise<T[]> {
        return this.model.bulkCreate(data as any, { transaction });
    }
}
