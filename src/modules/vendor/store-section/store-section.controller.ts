import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { StoreSectionService } from './store-section.service';
import { TokenAuthGuard } from 'src/modules/auth/token-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiSuccessResponse } from 'src/shared/dto/common/api.response';
import { PermissionsGuard } from 'src/modules/user/permission/permissions.guard';
import { Permissions } from 'src/modules/user/permission/permissions.decorator';
import { SectionModel } from 'src/infrastructure';
import { CreateSectionDto, UpdateSectionDto } from './dto';

@ApiTags('Vendor - Store Sections')
@ApiBearerAuth()
@UseGuards(TokenAuthGuard, PermissionsGuard)
@Controller('vendors/:vendorId/stores/:storeId/sections')
export class StoreSectionController {
  constructor(private readonly sectionService: StoreSectionService) { }

  @Post()
  @Permissions('section:create')
  @ApiSuccessResponse(SectionModel)
  async create(@Body() data: CreateSectionDto): Promise<SectionModel> {
    return await this.sectionService.create(data);
  }

  @Get()
  @ApiSuccessResponse(SectionModel)
  findAll(
    @Param('storeId', ParseIntPipe) storeId: number,
    @Param('vendorId', ParseIntPipe) vendorId: number,
  ): Promise<SectionModel[]> {
    return this.sectionService.findAllByStore(storeId, vendorId);
  }

  @Get(':id')
  @ApiSuccessResponse(SectionModel)
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Param('storeId', ParseIntPipe) storeId: number,
    @Param('vendorId', ParseIntPipe) vendorId: number,
  ): Promise<SectionModel> {
    return this.sectionService.findOneByStore(id, storeId, vendorId);
  }

  @Patch(':id')
  @ApiSuccessResponse(SectionModel)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Param('storeId', ParseIntPipe) storeId: number,
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Body() data: UpdateSectionDto,
  ): Promise<SectionModel> {
    return this.sectionService.updateByStore(storeId, id, data);
  }

  @Delete(':id')
  @ApiSuccessResponse(SectionModel)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Param('storeId', ParseIntPipe) storeId: number,
    // @Param('vendorId', ParseIntPipe) vendorId: number,
  ): Promise<void> {
    return this.sectionService.removeByStore(storeId, id);
  }
}
