import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { CityModel } from 'src/infrastructure';

@Module({
  imports: [SequelizeModule.forFeature([CityModel])],
  providers: [CityService],
  controllers: [CityController],
})
export class CityModule { }
