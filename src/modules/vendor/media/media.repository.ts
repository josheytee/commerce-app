import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from 'src/infrastructure/database/repositories/base.repository';

import { CreateMediaDto } from './dto';
import { MediaModel } from 'src/infrastructure';
import { MediaTypeEnum } from 'src/shared';

@Injectable()
export class MediaRepository extends BaseRepository<MediaModel> {
    constructor(
        @InjectModel(MediaModel)
        private mediaModel: typeof MediaModel,
    ) {
        super(mediaModel);
    }
    async create(
        createMediaDto: CreateMediaDto,
        userId?: number,
    ): Promise<MediaModel> {
        const payload = {
            ...createMediaDto,
            uploaded_by: userId,
        };
        const media = await super.create(payload);
        return media;
    }

    async createMultiple(
        createMediaDtos: CreateMediaDto[],
        userId?: number,
    ): Promise<MediaModel[]> {
        const medias = createMediaDtos.map((dto) => {
            return {
                ...dto,
                uploaded_by: userId,
            };
        });
        return await this.bulkCreate(medias);
    }
    async createVendorImage(
        vendorId: number,
        imageUrl: string,
    ): Promise<MediaModel> {
        return this.create({
            entity_id: vendorId,
            url: imageUrl,
            entity_type: 'vendor',
            is_primary: true,
            alt_text: 'VendorModel Logo',
            type: MediaTypeEnum.VENDOR_LOGO,
        });
    }

    // async findAll(options?: {
    //     entity_type?: string;
    //     entity_id?: number;
    //     type?: MediaTypeEnum;
    //     is_primary?: boolean;
    // }): Promise<MediaModel[]> {
    //     const where: FindOptionsWhere<MediaModel> = {};

    //     if (options?.entity_type) where.entity_type = options.entity_type;
    //     if (options?.entity_id) where.entity_id = options.entity_id;
    //     if (options?.type) where.type = options.type;
    //     if (options?.is_primary !== undefined)
    //         where.is_primary = options.is_primary;

    //     return await this.find({
    //         where,
    //         order: { sort_order: 'ASC', created_at: 'DESC' },
    //     });
    // }

    async removeByEntity(entity_type: string, entity_id: number): Promise<void> {
        const entity = await this.findOne({
            where: { entity_type, entity_id },
        });
        await this.delete(entity.id);
    }

    // async setPrimary(
    //     entity_type: string,
    //     entity_id: number,
    //     mediaId: number,
    // ): Promise<void> {
    //     // Remove primary flag from all media of this entity
    //     await this.update(
    //         { entity_type, entity_id, is_primary: true },
    //         { is_primary: false },
    //     );

    // Set the new primary
    // await this.mediaRepository.update({ id: mediaId }, { is_primary: true });
    // }

    async getPrimary(
        entity_type: string,
        entity_id: number,
    ): Promise<MediaModel | null> {
        return await this.findOne({
            where: { entity_type, entity_id, is_primary: true },
        });
    }

    async getGallery(
        entity_type: string,
        entity_id: number,
    ): Promise<MediaModel[]> {
        return await this.findAll({
            where: { entity_type, entity_id, is_primary: false },
            // order: { id: 'ASC' },
        });
    }

    async updateSortOrder(
        entity_type: string,
        entity_id: number,
        mediaIds: number[],
    ): Promise<void> {
        for (let i = 0; i < mediaIds.length; i++) {
            await this.update(
                mediaIds[i],
                { id: mediaIds[i], entity_type, entity_id },
                // { sort_order: i }
            );
        }
    }
}
