import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Country } from './country.model';

@Injectable()
export class CountryService {
  constructor(@InjectModel(Country) private countryModel: typeof Country) {}

  async create(data: { name: string; code: string }) {
    return this.countryModel.create(data);
  }

  async findAll() {
    return this.countryModel.findAll();
  }
}
