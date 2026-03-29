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
import { ApiTags } from '@nestjs/swagger';
import { ApiSuccessResponse } from 'src/api.response';

@ApiTags('Sections')
@Controller('sections')
@UseGuards(TokenAuthGuard, PermissionsGuard)
export class SectionController {
  constructor(private readonly sectionService: SectionService) { }

  @Post()
  @Permissions('section:create')
  @ApiSuccessResponse(Section)
  create(@Body() data: Partial<Section>): Promise<Section> {
    return this.sectionService.create(data);
  }

  @Get()
  @ApiSuccessResponse(Section)
  findAll(): Promise<Section[]> {
    return this.sectionService.findAll();
  }

  @Get(':id')
  @ApiSuccessResponse(Section)
  findOne(@Param('id') id: number): Promise<Section> {
    return this.sectionService.findOne(id);
  }

  @Patch(':id')
  @ApiSuccessResponse(Section)
  update(
    @Param('id') id: number,
    @Body() data: Partial<Section>,
  ): Promise<Section> {
    return this.sectionService.update(id, data);
  }

  @Delete(':id')
  @ApiSuccessResponse(Section)
  remove(@Param('id') id: number): Promise<void> {
    return this.sectionService.remove(id);
  }
}
