import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CityService } from './city.service';

@Controller('cities')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Post()
  create(@Body() data: { name: string; state_id: number }) {
    return this.cityService.create(data);
  }

  @Get(':stateId')
  findAllByState(@Param('stateId') stateId: number) {
    return this.cityService.findAllByState(stateId);
  }
}
