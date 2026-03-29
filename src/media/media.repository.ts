import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from 'src/database/repositories/base.repository';

import { Media } from './models/media.model';
import { CreateMediaDto } from './dto';
import { MediaType } from './models/media-type.enum';

@Injectable()
export class MediaRepository extends BaseRepository<Media> {
    constructor(
        @InjectModel(Media)
        private mediaModel: typeof Media,
    ) {
        super(mediaModel);
    }
    async create(
        createMediaDto: CreateMediaDto,
        userId?: number,
    ): Promise<Media> {
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
    ): Promise<Media[]> {
        const medias = createMediaDtos.map((dto) => {
            return {
                ...dto,
                uploaded_by: userId,
            };
        });
        return await this.bulkCreate(medias);
    }
    async createVendorImage(vendorId: number, imageUrl: string): Promise<Media> {
        return this.create({
            entity_id: vendorId,
            url: imageUrl,
            entity_type: 'vendor',
            is_primary: true,
            alt_text: 'Vendor Logo',
            type: MediaType.VENDOR_LOGO,
        });
    }

    // async findAll(options?: {
    //     entity_type?: string;
    //     entity_id?: number;
    //     type?: MediaType;
    //     is_primary?: boolean;
    // }): Promise<Media[]> {
    //     const where: FindOptionsWhere<Media> = {};

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
    ): Promise<Media | null> {
        return await this.findOne({
            where: { entity_type, entity_id, is_primary: true },
        });
    }

    async getGallery(entity_type: string, entity_id: number): Promise<Media[]> {
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
