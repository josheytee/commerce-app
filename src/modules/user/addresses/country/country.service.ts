import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CountryModel } from 'src/infrastructure';

@Injectable()
export class CountryService {
  constructor(
    @InjectModel(CountryModel) private countryModel: typeof CountryModel,
  ) { }

  async create(data: { name: string; code: string }) {
    return this.countryModel.create(data);
  }

  async findAll() {
    return this.countryModel.findAll();
  }
}
