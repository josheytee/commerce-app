import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediaModel } from 'src/infrastructure';
import { MediaTypeEnum } from 'src/shared';

@Injectable()
export class MediaService {
  constructor(
    @InjectModel(MediaModel)
    private mediaModel: typeof MediaModel,
  ) { }

  async create(
    createMediaDto: CreateMediaDto,
    userId?: number,
  ): Promise<MediaModel> {
    return await this.mediaModel.create({
      ...createMediaDto,
      uploaded_by: userId,
    });
  }

  async createMultiple(
    createMediaDtos: CreateMediaDto[],
    userId?: number,
  ): Promise<MediaModel[]> {
    const medias = createMediaDtos.map((dto) => ({
      ...dto,
      uploaded_by: userId,
    }));
    return await this.mediaModel.bulkCreate(medias);
  }

  async findAll(options?: {
    entity_type?: string;
    entity_id?: number;
    type?: MediaTypeEnum;
    is_primary?: boolean;
  }): Promise<MediaModel[]> {
    const where: any = {};

    if (options?.entity_type) where.entity_type = options.entity_type;
    if (options?.entity_id) where.entity_id = options.entity_id;
    if (options?.type) where.type = options.type;
    if (options?.is_primary !== undefined)
      where.is_primary = options.is_primary;

    return await this.mediaModel.findAll({
      where,
      order: [
        ['sort_order', 'ASC'],
        ['created_at', 'DESC'],
      ],
    });
  }

  async findOne(id: number): Promise<MediaModel> {
    const media = await this.mediaModel.findByPk(id);
    if (!media) {
      throw new NotFoundException(`MediaModel with ID ${id} not found`);
    }
    return media;
  }

  async update(
    id: number,
    updateMediaDto: UpdateMediaDto,
  ): Promise<MediaModel> {
    const media = await this.findOne(id);
    await media.update(updateMediaDto);
    return media;
  }

  async remove(id: number): Promise<void> {
    const media = await this.findOne(id);
    await media.destroy();
  }

  async removeByEntity(entity_type: string, entity_id: number): Promise<void> {
    await this.mediaModel.destroy({
      where: { entity_type, entity_id },
    });
  }

  async setPrimary(
    entity_type: string,
    entity_id: number,
    mediaId: number,
  ): Promise<void> {
    // Remove primary flag from all media of this entity
    await this.mediaModel.update(
      { is_primary: false },
      { where: { entity_type, entity_id, is_primary: true } },
    );

    // Set the new primary
    await this.mediaModel.update(
      { is_primary: true },
      { where: { id: mediaId } },
    );
  }

  async getPrimary(
    entity_type: string,
    entity_id: number,
  ): Promise<MediaModel | null> {
    return await this.mediaModel.findOne({
      where: { entity_type, entity_id, is_primary: true },
    });
  }

  async getGallery(
    entity_type: string,
    entity_id: number,
  ): Promise<MediaModel[]> {
    return await this.mediaModel.findAll({
      where: { entity_type, entity_id, is_primary: false },
      order: [['sort_order', 'ASC']],
    });
  }

  async updateSortOrder(
    entity_type: string,
    entity_id: number,
    mediaIds: number[],
  ): Promise<void> {
    for (let i = 0; i < mediaIds.length; i++) {
      await this.mediaModel.update(
        { sort_order: i },
        { where: { id: mediaIds[i], entity_type, entity_id } },
      );
    }
  }

  async getStats(
    entity_type: string,
    entity_id: number,
  ): Promise<{
    total: number;
    primary: MediaModel | null;
    gallery_count: number;
    by_type: Record<string, number>;
  }> {
    const total = await this.mediaModel.count({
      where: { entity_type, entity_id },
    });

    const primary = await this.getPrimary(entity_type, entity_id);

    const gallery_count = await this.mediaModel.count({
      where: { entity_type, entity_id, is_primary: false },
    });

    const byTypeResult = await this.mediaModel.findAll({
      attributes: [
        'type',
        [
          this.mediaModel.sequelize.fn(
            'COUNT',
            this.mediaModel.sequelize.col('id'),
          ),
          'count',
        ],
      ],
      where: { entity_type, entity_id },
      group: ['type'],
    });

    const by_type: Record<string, number> = {};
    byTypeResult.forEach((result) => {
      by_type[result.get('type') as string] = parseInt(
        result.get('count') as string,
      );
    });

    return { total, primary, gallery_count, by_type };
  }
}
