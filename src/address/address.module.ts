import { Module } from '@nestjs/common';
import { CountryModule } from './country/country.module';
import { StateModule } from './state/state.module';
import { CityModule } from './city/city.module';

@Module({
  imports: [CountryModule, StateModule, CityModule],
})
export class AddressModule {}
