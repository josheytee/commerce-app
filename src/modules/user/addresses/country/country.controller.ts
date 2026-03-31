import { Controller, Get, Post, Body } from '@nestjs/common';
import { CountryService } from './country.service';

@Controller('countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Post()
  create(@Body() data: { name: string; code: string }) {
    return this.countryService.create(data);
  }

  @Get()
  findAll() {
    return this.countryService.findAll();
  }
}
