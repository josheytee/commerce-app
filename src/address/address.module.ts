import { Module } from '@nestjs/common';
import { CountryModule } from './country/country.module';
import { StateModule } from './state/state.module';
import { CityModule } from './city/city.module';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Address } from './address.model';

@Module({
  imports: [
    CountryModule,
    StateModule,
    CityModule,
    SequelizeModule.forFeature([Address]),
  ],
  providers: [AddressService],
  controllers: [AddressController],
})
export class AddressModule {}
