import { Module } from '@nestjs/common';
import { CountryModule } from './country/country.module';
import { StateModule } from './state/state.module';
import { CityModule } from './city/city.module';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { AddressRepository } from './address.repository';
import { AddressModel } from 'src/infrastructure';

@Module({
  imports: [
    CountryModule,
    StateModule,
    CityModule,
    SequelizeModule.forFeature([AddressModel]),
  ],
  providers: [AddressRepository, AddressService],
  controllers: [AddressController],
  exports: [AddressRepository, AddressService],
})
export class AddressModule { }
