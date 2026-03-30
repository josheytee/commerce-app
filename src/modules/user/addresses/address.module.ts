import { Module } from '@nestjs/common';
import { CountryModule } from './country/country.module';
import { StateModule } from './state/state.module';
import { CityModule } from './city/city.module';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Address } from './address.model';
import { AddressRepository } from './address.repository';

@Module({
  imports: [
    CountryModule,
    StateModule,
    CityModule,
    SequelizeModule.forFeature([Address]),
  ],
  providers: [AddressRepository, AddressService],
  controllers: [AddressController],
  exports: [AddressRepository, AddressService],
})
export class AddressModule { }
