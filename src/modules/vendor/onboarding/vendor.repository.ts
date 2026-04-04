// repositories/vendor.repository.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from 'src/infrastructure/database/repositories/base.repository';
import { CreateMediaDto } from 'src/modules/vendor/media/dto';
import { MediaTypeEnum } from 'src/shared/';
import { MediaRepository } from 'src/modules/vendor/media/media.repository';
import { MediaModel, VendorModel } from 'src/infrastructure';
import { Op } from 'sequelize';

@Injectable()
export class VendorRepository extends BaseRepository<VendorModel> {
    constructor(
        @InjectModel(VendorModel)
        private vendorModel: typeof VendorModel,
        private mediaRepository: MediaRepository,
    ) {
        super(vendorModel);
    }

    // async findSingle(id: number) {
    //     const vendor = await this.vendorModel.findByPk(id);
    //     if (!vendor) {
    //         throw new Error('VendorModel not found');
    //     }

    //     // Get media
    //     const logo = await this.mediaService.getPrimary('vendor', id);
    //     const gallery = await this.mediaService.getGallery('vendor', id);
    //     const mediaStats = await this.mediaService.getStats('vendor', id);

    //     // Get reviews
    //     const reviews = await this.reviewService.findAll({
    //         entity_type: 'vendor',
    //         entity_id: id,
    //         is_approved: true,
    //         limit: 10,
    //     });

    //     // Get rating stats
    //     const ratingStats = await this.ratingService.getStats('vendor', id);

    //     return {
    //         ...vendor.toJSON(),
    //         logo,
    //         gallery,
    //         mediaStats,
    //         reviews: reviews.data,
    //         ratingStats,
    //     };
    // }

    async findByBusinessName(name: string): Promise<VendorModel | null> {
        return this.findOne({
            where: { business_name: name },
        });
    }

    async findByUserId(userId: number): Promise<VendorModel[] | null> {
        return this.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: MediaModel,
                    as: 'images',
                    where: { entity_type: 'vendor' },
                    separate: true,
                    required: false, // LEFT JOIN - get vendors even without images
                },
            ],
        });
    }

    async findWithFullDetails(id: number): Promise<VendorModel | null> {
        return this.findById(id, {
            include: ['user', 'stores', 'users'],
        });
    }

    async addVendorLogo(vendorId: number, imageUrl: string): Promise<MediaModel> {
        return this.mediaRepository.createVendorImage(vendorId, imageUrl);
    }

    async setAsDefault(
        userId: number,
        vendorId: number,
    ): Promise<VendorModel | null> {
        // Verify vendor belongs to user
        const vendor = await this.vendorModel.findOne({
            where: { id: vendorId, user_id: userId },
        });

        if (!vendor) {
            throw new Error(
                `Vendor with ID ${vendorId} not found for user ${userId}`,
            );
        }

        const transaction = await this.vendorModel.sequelize!.transaction();

        try {
            // Reset all other vendors for this user
            await this.vendorModel.update(
                { is_default: false },
                {
                    where: { user_id: userId, id: { [Op.ne]: vendorId } },
                    transaction,
                },
            );

            // Set the selected vendor as default
            await this.vendorModel.update(
                { is_default: true },
                {
                    where: { id: vendorId },
                    transaction,
                },
            );

            await transaction.commit();

            return this.findById(vendorId);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async getDefaultVendor(userId: number): Promise<VendorModel | null> {
        return this.vendorModel.findOne({
            where: { user_id: userId, is_default: true },
        });
    }
}
