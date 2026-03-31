import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CountryService } from './country.service';
import { CountryController } from './country.controller';
import { CountryModel } from 'src/infrastructure';

@Module({
  imports: [SequelizeModule.forFeature([CountryModel])],
  providers: [CountryService],
  controllers: [CountryController],
})
export class CountryModule { }
