import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Section } from './section.model';
import { Product } from '../products/product.model';

@Injectable()
export class SectionService {
  constructor(
    @InjectModel(Section)
    private sectionModel: typeof Section,
  ) { }

  async create(data: Partial<Section>): Promise<Section> {
    return this.sectionModel.create(data);
  }

  async findAll(): Promise<Section[]> {
    return this.sectionModel.findAll({ include: [Product] });
  }

  async findOne(id: number): Promise<Section> {
    const section = await this.sectionModel.findByPk(id, {
      include: [Product],
    });
    if (!section) {
      throw new NotFoundException('Section not found');
    }
    return section;
  }

  async update(id: number, data: Partial<Section>): Promise<Section> {
    const section = await this.findOne(id);
    return section.update(data);
  }

  async remove(id: number): Promise<void> {
    const section = await this.findOne(id);
    await section.destroy();
  }
}
