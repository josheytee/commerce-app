import { Controller, Get, Post, Body } from '@nestjs/common';
import { CountryService } from './country.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('countries')
@ApiTags('Addresses')
export class CountryController {
  constructor(private readonly countryService: CountryService) { }

  @Post()
  create(@Body() data: { name: string; code: string }) {
    return this.countryService.create(data);
  }

  @Get()
  findAll() {
    return this.countryService.findAll();
  }
}
