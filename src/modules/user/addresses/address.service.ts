import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AddressModel } from 'src/infrastructure';

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(AddressModel)
    private readonly addressModel: typeof AddressModel,
  ) { }

  async createAddress(createAddressDto: any): Promise<AddressModel> {
    return this.addressModel.create(createAddressDto);
  }

  async findAllAddresses(): Promise<AddressModel[]> {
    return this.addressModel.findAll();
  }

  async findAddressById(id: string): Promise<AddressModel> {
    const address = await this.addressModel.findByPk(id);
    if (!address) {
      throw new NotFoundException('AddressModel not found');
    }
    return address;
  }

  async updateAddress(
    id: string,
    updateAddressDto: any,
  ): Promise<AddressModel> {
    const address = await this.findAddressById(id);
    return address.update(updateAddressDto);
  }

  async deleteAddress(id: string): Promise<void> {
    const address = await this.findAddressById(id);
    await address.destroy();
  }
}
