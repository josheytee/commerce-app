import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { StateService } from './state.service';

@Controller('states')
export class StateController {
  constructor(private readonly stateService: StateService) {}

  @Post()
  create(@Body() data: { name: string; country_id: number }) {
    return this.stateService.create(data);
  }

  @Get(':countryId')
  findAllByCountry(@Param('countryId') countryId: number) {
    return this.stateService.findAllByCountry(countryId);
  }
}
