import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SectionService } from './section.service';
import { Section } from './section.model';

import { Permissions } from 'src/account/permission/permissions.decorator';
import { PermissionsGuard } from 'src/account/permission/permissions.guard';
import { TokenAuthGuard } from 'src/account/auth/token-auth.guard';

@Controller('sections')
@UseGuards(TokenAuthGuard, PermissionsGuard)
export class SectionController {
  constructor(private readonly sectionService: SectionService) { }

  @Post()
  @Permissions('section:create')
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
