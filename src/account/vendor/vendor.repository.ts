// repositories/vendor.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Vendor } from './vendor.model';
import { BaseRepository } from 'src/database/repositories/base.repository';

@Injectable()
export class VendorRepository extends BaseRepository<Vendor> {
    constructor(
        @InjectModel(Vendor)
        private vendorModel: typeof Vendor,
    ) {
        super(vendorModel);
    }

    async findByBusinessName(name: string): Promise<Vendor | null> {
        return this.findOne({
            where: { business_name: name },
        });
    }
    async findByUserId(userId: number): Promise<Vendor[] | null> {
        return this.findAll({
            where: { user_id: userId },
        });
    }

    async findWithFullDetails(id: number): Promise<Vendor | null> {
        return this.findById(id, {
            include: ['user', 'stores', 'users'],
        });
    }
}
