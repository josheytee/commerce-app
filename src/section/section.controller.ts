import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { SectionService } from './section.service';
import { Section } from './section.model';

@Controller('sections')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Post()
  create(@Body() data: Partial<Section>): Promise<Section> {
    return this.sectionService.create(data);
  }

  @Get()
  findAll(): Promise<Section[]> {
    return this.sectionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Section> {
    return this.sectionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() data: Partial<Section>,
  ): Promise<Section> {
    return this.sectionService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.sectionService.remove(id);
  }
}
