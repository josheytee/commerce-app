import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSectionDto, UpdateSectionDto } from './dto';
import { SectionModel } from 'src/infrastructure';
import { SectionRepository } from 'src/infrastructure/database/repositories';
import { StringUtils } from 'src/shared/utils';

@Injectable()
export class StoreSectionService {
  constructor(private readonly sectionRepository: SectionRepository) { }

  async create(data: CreateSectionDto): Promise<SectionModel> {
    return this.sectionRepository.create({
      ...data,
      slug: data.slug || StringUtils.slugify(data.name),
    });
  }

  async findOneByStore(
    id: number,
    storeId: number,
    vendorId: number,
  ): Promise<SectionModel> {
    return this.sectionRepository.findOneByStore(storeId, id);
  }

  async findAllByStore(
    storeId: number,
    vendorId: number,
  ): Promise<SectionModel[]> {
    return this.sectionRepository.findByStore(storeId, vendorId);
  }

  async findOne(id: number): Promise<SectionModel> {
    const section = await this.sectionRepository.findOne({ where: { id } });
    if (!section)
      throw new NotFoundException(`Section with id ${id} not found`);
    return section;
  }

  async updateByStore(
    storeId: number,
    sectionId: number,
    data: UpdateSectionDto,
  ): Promise<SectionModel> {
    const section = await this.sectionRepository.findOneByStore(
      storeId,
      sectionId,
    );
    if (!section)
      throw new NotFoundException(`Section with id ${sectionId} not found`);

    return section.update(data);
  }

  async removeByStore(storeId: number, sectionId: number): Promise<void> {
    const section = await this.sectionRepository.findOneByStore(
      storeId,
      sectionId,
    );
    if (!section)
      throw new NotFoundException(`Section with id ${sectionId} not found`);

    await section.destroy();
  }
}
