import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Attribute } from './models/attribute.model';
import { CreateAttributeDto } from './dto/create_attribute.dto';
import { UpdateAttributeDto } from './dto/update_attribute.dto';

@Injectable()
export class AttributeService {
  constructor(
    @InjectModel(Attribute)
    private readonly attributeModel: typeof Attribute,
  ) {}

  async create(createAttributeDto: CreateAttributeDto): Promise<Attribute> {
    return this.attributeModel.create(createAttributeDto);
  }

  async findAll(): Promise<Attribute[]> {
    return this.attributeModel.findAll();
  }

  async findOne(id: number): Promise<Attribute> {
    return this.attributeModel.findByPk(id);
  }

  async update(
    id: number,
    updateAttributeDto: UpdateAttributeDto,
  ): Promise<[number, Attribute[]]> {
    return this.attributeModel.update(updateAttributeDto, {
      where: { id },
      returning: true,
    });
  }

  async remove(id: number): Promise<void> {
    const attribute = await this.findOne(id);
    await attribute.destroy();
  }
}
