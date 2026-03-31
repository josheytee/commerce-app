import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SectionModel, ProductModel } from 'src/infrastructure';

@Injectable()
export class SectionService {
  constructor(
    @InjectModel(SectionModel)
    private sectionModel: typeof SectionModel,
  ) { }

  async create(data: Partial<SectionModel>): Promise<SectionModel> {
    return this.sectionModel.create(data);
  }

  async findAll(): Promise<SectionModel[]> {
    return this.sectionModel.findAll({ include: [ProductModel] });
  }

  async findOne(id: number): Promise<SectionModel> {
    const section = await this.sectionModel.findByPk(id, {
      include: [ProductModel],
    });
    if (!section) {
      throw new NotFoundException('SectionModel not found');
    }
    return section;
  }

  async update(id: number, data: Partial<SectionModel>): Promise<SectionModel> {
    const section = await this.findOne(id);
    return section.update(data);
  }

  async remove(id: number): Promise<void> {
    const section = await this.findOne(id);
    await section.destroy();
  }
}
