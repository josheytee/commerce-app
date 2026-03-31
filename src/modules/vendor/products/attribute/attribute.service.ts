import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AttributeModel } from 'src/infrastructure';
import { CreateAttributeDto } from './dto/create_attribute.dto';
import { UpdateAttributeDto } from './dto/update_attribute.dto';

@Injectable()
export class AttributeService {
  constructor(
    @InjectModel(AttributeModel)
    private readonly attributeModel: typeof AttributeModel,
  ) { }

  async create(
    createAttributeDto: CreateAttributeDto,
  ): Promise<AttributeModel> {
    return this.attributeModel.create(createAttributeDto);
  }

  async findAll(): Promise<AttributeModel[]> {
    return this.attributeModel.findAll();
  }

  async findOne(id: number): Promise<AttributeModel> {
    return this.attributeModel.findByPk(id);
  }

  async update(
    id: number,
    updateAttributeDto: UpdateAttributeDto,
  ): Promise<[number, AttributeModel[]]> {
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
