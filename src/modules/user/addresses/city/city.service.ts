import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CityModel } from 'src/infrastructure';

@Injectable()
export class CityService {
  constructor(@InjectModel(CityModel) private cityModel: typeof CityModel) { }

  async create(data: { name: string; state_id: number }) {
    return this.cityModel.create(data);
  }

  async findAllByState(stateId: number) {
    return this.cityModel.findAll({ where: { state_id: stateId } });
  }
}
