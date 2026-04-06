import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from './base.repository';
import { CustomerModel } from '../models';

@Injectable()
export class CustomerRepository extends BaseRepository<CustomerModel> {
    constructor(
        @InjectModel(CustomerModel)
        private customerModel: typeof CustomerModel,
    ) {
        super(customerModel);
    }
}
