import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { AttributeService } from './attribute.service';
import { CreateAttributeDto } from './dto/create_attribute.dto';
import { UpdateAttributeDto } from './dto/update_attribute.dto';
import { ListAttributeDto } from './dto/list-attribute.dto';
import { AuthenticatedRequest } from 'src/modules/auth';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { AttributeResponseDto } from './dto/attribute-response.dto';

@Controller('attributes')
export class AttributeController {
  constructor(private readonly attributeService: AttributeService) { }

  @Get('/vendor')
  async list(
    @Query() query: ListAttributeDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.attributeService.listForVendor(req.user.id, query);
  }

  @Post('/vendor')
  @ApiOperation({ summary: 'Create a vendor-owned attribute' })
  @ApiCreatedResponse({ type: AttributeResponseDto })
  async createVendor(
    @Body() dto: CreateAttributeDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.attributeService.createForVendor(req.user.id, dto);
  }

  @Post()
  create(@Body() createAttributeDto: CreateAttributeDto) {
    return this.attributeService.create(createAttributeDto);
  }

  @Get()
  findAll() {
    return this.attributeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attributeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAttributeDto: UpdateAttributeDto,
  ) {
    return this.attributeService.update(
      +id,
      { isAdmin: true },
      updateAttributeDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attributeService.remove(+id);
  }
}
