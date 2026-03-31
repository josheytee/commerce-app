import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { StateModel } from 'src/infrastructure';

@Injectable()
export class StateService {
  constructor(@InjectModel(StateModel) private stateModel: typeof StateModel) { }

  async create(data: { name: string; country_id: number }) {
    return this.stateModel.create(data);
  }

  async findAllByCountry(countryId: number) {
    return this.stateModel.findAll({ where: { country_id: countryId } });
  }
}
