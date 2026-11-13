// src/modules/attribute/attribute.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AttributeService } from './attribute.service';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { CreateAttributeValueDto } from './dto/create-attribute-value.dto';
import { UpdateAttributeValueDto } from './dto/update-attribute-value.dto';
import { QueryAttributeDto } from './dto/query-attribute.dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
// import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
// import { RolesGuard } from 'src/common/guards/roles.guard';
// import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('attributes')
// @UseGuards(JwtAuthGuard)
export class AttributeController {
  constructor(private readonly attributeService: AttributeService) { }

  // ============================================================
  // PUBLIC READ
  // ============================================================

  /** List all attributes (filterable). Safe to call from the storefront. */
  @Get()
  // @Roles('admin', 'vendor', 'customer')
  async findAll(@Query() query: QueryAttributeDto) {
    return this.attributeService.findAll(query);
  }

  /** Fetch a single attribute by numeric id. */
  @Get(':id')
  // @Roles('admin', 'vendor', 'customer')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.attributeService.findOne(id);
  }

  /** Fetch a single attribute by slug (useful for SEO / deep links). */
  @Get('slug/:slug')
  // @Roles('admin', 'vendor', 'customer')
  async findBySlug(@Param('slug') slug: string) {
    return this.attributeService.findBySlug(slug);
  }

  /** List values for a given attribute. */
  @Get(':id/values')
  // @Roles('admin', 'vendor', 'customer')
  async listValues(@Param('id', ParseIntPipe) id: number) {
    return this.attributeService.listValues(id);
  }

  // ============================================================
  // ADMIN WRITE
  // ============================================================

  @Post()
  // @Roles('admin')
  async create(@Body() dto: CreateAttributeDto) {
    return this.attributeService.create(dto);
  }

  @Patch(':id')
  // @Roles('admin')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAttributeDto,
  ) {
    return this.attributeService.update(id, dto);
  }

  @Delete(':id')
  // @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.attributeService.remove(id);
  }

  // ============================================================
  // ATTRIBUTE VALUES
  // ============================================================

  @Post(':id/values')
  // @Roles('admin')
  async createValue(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateAttributeValueDto,
  ) {
    return this.attributeService.createValue(id, dto);
  }

  @Patch(':id/values/:valueId')
  // @Roles('admin')
  async updateValue(
    @Param('id', ParseIntPipe) id: number,
    @Param('valueId', ParseIntPipe) valueId: number,
    @Body() dto: UpdateAttributeValueDto,
  ) {
    return this.attributeService.updateValue(id, valueId, dto);
  }

  @Delete(':id/values/:valueId')
  // @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeValue(
    @Param('id', ParseIntPipe) id: number,
    @Param('valueId', ParseIntPipe) valueId: number,
  ) {
    await this.attributeService.removeValue(id, valueId);
  }

  @Put(':id/values/reorder')
  // @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  async reorderValues(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { ids: number[] },
  ) {
    await this.attributeService.reorderValues(id, body.ids);
  }
}
