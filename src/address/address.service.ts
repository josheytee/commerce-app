import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Address } from './address.model';

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(Address)
    private readonly addressModel: typeof Address,
  ) {}

  async createAddress(createAddressDto: any): Promise<Address> {
    return this.addressModel.create(createAddressDto);
  }

  async findAllAddresses(): Promise<Address[]> {
    return this.addressModel.findAll();
  }

  async findAddressById(id: string): Promise<Address> {
    const address = await this.addressModel.findByPk(id);
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    return address;
  }

  async updateAddress(id: string, updateAddressDto: any): Promise<Address> {
    const address = await this.findAddressById(id);
    return address.update(updateAddressDto);
  }

  async deleteAddress(id: string): Promise<void> {
    const address = await this.findAddressById(id);
    await address.destroy();
  }
}
