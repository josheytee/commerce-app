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
import { TokenAuthGuard } from 'src/modules/auth/token-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { ApiSuccessResponse } from 'src/api.response';
import { PermissionsGuard } from 'src/modules/user/permission/permissions.guard';
import { Permissions } from 'src/modules/user/permission/permissions.decorator';
import { SectionModel } from 'src/infrastructure';

@ApiTags('Sections')
@Controller('sections')
@UseGuards(TokenAuthGuard, PermissionsGuard)
export class SectionController {
  constructor(private readonly sectionService: SectionService) { }

  @Post()
  @Permissions('section:create')
  @ApiSuccessResponse(SectionModel)
  create(@Body() data: Partial<SectionModel>): Promise<SectionModel> {
    return this.sectionService.create(data);
  }

  @Get()
  @ApiSuccessResponse(SectionModel)
  findAll(): Promise<SectionModel[]> {
    return this.sectionService.findAll();
  }

  @Get(':id')
  @ApiSuccessResponse(SectionModel)
  findOne(@Param('id') id: number): Promise<SectionModel> {
    return this.sectionService.findOne(id);
  }

  @Patch(':id')
  @ApiSuccessResponse(SectionModel)
  update(
    @Param('id') id: number,
    @Body() data: Partial<SectionModel>,
  ): Promise<SectionModel> {
    return this.sectionService.update(id, data);
  }

  @Delete(':id')
  @ApiSuccessResponse(SectionModel)
  remove(@Param('id') id: number): Promise<void> {
    return this.sectionService.remove(id);
  }
}
