import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Country } from './country.model';
import { CountryService } from './country.service';
import { CountryController } from './country.controller';

@Module({
  imports: [SequelizeModule.forFeature([Country])],
  providers: [CountryService],
  controllers: [CountryController],
})
export class CountryModule {}
