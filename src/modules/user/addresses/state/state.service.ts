import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { State } from './state.model';

@Injectable()
export class StateService {
  constructor(@InjectModel(State) private stateModel: typeof State) {}

  async create(data: { name: string; country_id: number }) {
    return this.stateModel.create(data);
  }

  async findAllByCountry(countryId: number) {
    return this.stateModel.findAll({ where: { country_id: countryId } });
  }
}
