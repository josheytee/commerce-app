import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Customer } from './customer.model';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer)
    private customerModel: typeof Customer,
  ) {}

  async create(data: Partial<Customer>): Promise<Customer> {
    return this.customerModel.create(data);
  }

  async findAll(): Promise<Customer[]> {
    return this.customerModel.findAll();
  }

  async findOne(id: number): Promise<Customer> {
    const customer = await this.customerModel.findByPk(id);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  async update(id: number, data: Partial<Customer>): Promise<Customer> {
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
