import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CustomerModel } from 'src/infrastructure';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(CustomerModel)
    private customerModel: typeof CustomerModel,
  ) { }

  async create(data: Partial<CustomerModel>): Promise<CustomerModel> {
    return this.customerModel.create(data);
  }

  async findAll(): Promise<CustomerModel[]> {
    return this.customerModel.findAll();
  }

  async findOne(id: number): Promise<CustomerModel> {
    const customer = await this.customerModel.findByPk(id);
    if (!customer) {
      throw new NotFoundException('CustomerModel not found');
    }
    return customer;
  }

  async update(id: number, data: Partial<CustomerModel>): Promise<CustomerModel> {
    const [numberOfAffectedRows] = await this.customerModel.update(data, {
      where: { id },
    });

    if (numberOfAffectedRows === 0) {
      return null; // No rows affected
    }

    return this.customerModel.findByPk(id);
  }

  async remove(id: number): Promise<void> {
    const customer = await this.findOne(id);
    await customer.destroy();
  }
}
