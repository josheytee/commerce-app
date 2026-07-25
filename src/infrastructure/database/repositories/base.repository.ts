// repositories/base.repository.ts
import {
    Model,
    ModelStatic,
    Transaction,
    WhereOptions,
    FindOptions,
} from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';

export abstract class BaseRepository<T extends Model> {
    constructor(protected readonly model: ModelStatic<T>) { }

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

    async findAndCountAll(
        options?: FindOptions,
    ): Promise<{ rows: T[]; count: number }> {
        return this.model.findAndCountAll(options);
    }

    async update(id: number, data: Partial<T>): Promise<[number, T[]]> {
        return this.model.update(data as any, {
            where: { id } as WhereOptions,
            returning: true,
        });
    }

    async updateWithTransaction(
        id: number,
        data: Partial<T>,
        transaction: Transaction,
    ): Promise<[number, T[]]> {
        return this.model.update(data as any, {
            where: { id } as WhereOptions,
            returning: true,
            transaction,
        });
    }

    async deleteById(id: number): Promise<number> {
        return this.model.destroy({ where: { id } as WhereOptions });
    }

    async delete(options: FindOptions): Promise<number> {
        return this.model.destroy(options);
    }

    async deleteByIdWithTransaction(
        id: number,
        // transaction: Transaction,
    ): Promise<number> {
        return this.model.destroy(
            { where: { id } as WhereOptions },
            //   { transaction },
        );
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
