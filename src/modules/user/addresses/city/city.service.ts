import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { City } from './city.model';

@Injectable()
export class CityService {
  constructor(@InjectModel(City) private cityModel: typeof City) {}

  async create(data: { name: string; state_id: number }) {
    return this.cityModel.create(data);
  }

  async findAllByState(stateId: number) {
    return this.cityModel.findAll({ where: { state_id: stateId } });
  }
}
