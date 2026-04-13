import { Module } from '@nestjs/common';
import { CountryModule } from './country/country.module';
import { StateModule } from './state/state.module';
import { CityModule } from './city/city.module';
import { AddressService } from './address.service';
import { CustomerAddressController } from './customer-address.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { AddressModel, CustomerModel, StoreModel } from 'src/infrastructure';
import {
  AddressRepository,
  CustomerRepository,
  StoreRepository,
} from 'src/infrastructure/database/repositories';
import { StoreAddressController } from './store-address.controller';

@Module({
  imports: [
    CountryModule,
    StateModule,
    CityModule,
    SequelizeModule.forFeature([AddressModel, StoreModel, CustomerModel]),
  ],
  providers: [
    AddressRepository,
    AddressService,
    StoreRepository,
    CustomerRepository,
  ],
  controllers: [CustomerAddressController, StoreAddressController],
  exports: [
    AddressRepository,
    CustomerRepository,
    AddressService,
    StoreRepository,
  ],
})
export class AddressModule { }
