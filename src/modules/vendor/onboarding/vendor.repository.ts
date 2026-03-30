// repositories/vendor.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Vendor } from './vendor.model';
import { BaseRepository } from 'src/infrastructure/database/repositories/base.repository';
import { CreateMediaDto } from 'src/modules/vendor/media/dto';
import { MediaType } from 'src/modules/vendor/media/models/media-type.enum';
import { MediaRepository } from 'src/modules/vendor/media/media.repository';
import { Media } from 'src/modules/vendor/media/models/media.model';

@Injectable()
export class VendorRepository extends BaseRepository<Vendor> {
    constructor(
        @InjectModel(Vendor)
        private vendorModel: typeof Vendor,
        private mediaRepository: MediaRepository,
    ) {
        super(vendorModel);
    }

    // async findSingle(id: number) {
    //     const vendor = await this.vendorModel.findByPk(id);
    //     if (!vendor) {
    //         throw new Error('Vendor not found');
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

    async findByBusinessName(name: string): Promise<Vendor | null> {
        return this.findOne({
            where: { business_name: name },
        });
    }

    async findByUserId(userId: number): Promise<Vendor[] | null> {
        return this.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: Media,
                    as: 'images',
                    where: { entity_type: 'vendor' },
                    separate: true,
                    required: false, // LEFT JOIN - get vendors even without images
                },
            ],
        });
    }

    async findWithFullDetails(id: number): Promise<Vendor | null> {
        return this.findById(id, {
            include: ['user', 'stores', 'users'],
        });
    }

    async addVendorLogo(vendorId: number, imageUrl: string): Promise<Media> {
        return this.mediaRepository.createVendorImage(vendorId, imageUrl);
    }
    // async addImage(vendorId: number, imageData: Media, userId: number) {
    //     // console.log('files', files);
    //     // const mediaDtos: CreateMediaDto[] = files.map((file, index) => ({
    //     //     url: file.url,
    //     //     key: file.key,
    //     //     thumbnail_url: file.thumbnail_url,
    //     //     medium_url: file.medium_url,
    //     //     // type: MediaType.VENDOR_GALLERY,
    //     //     entity_type: 'vendor',
    //     //     entity_id: vendorId,
    //     //     sort_order: index,
    //     //     file_size: file.size,
    //     //     mime_type: file.mimetype,
    //     // }));
    //     const mediaDtos: any = {
    //         url: imageData.url,
    //         key: imageData.key,
    //         entity_type: 'vendor',
    //         entity_id: vendorId,
    //         type: imageData.type || 'vendor_logo', // ⚠️ CRITICAL: Include the type!
    //         sort_order: imageData.sort_order || 0,
    //         is_primary: imageData.is_primary || false,
    //         uploaded_by: imageData.uploaded_by,
    //         alt_text: imageData.alt_text,
    //         title: imageData.title,
    //         caption: imageData.caption,
    //         file_size: imageData.file_size,
    //         mime_type: imageData.mime_type,
    //         metadata: imageData.metadata,
    //     };

    //     return await this.mediaRepository.create(mediaDtos, userId);
    // }

    // async addReview(vendorId: number, reviewDto: any, userId: number) {
    //     const review = await this.create(
    //         {
    //             ...reviewDto,
    //             entity_type: 'vendor',
    //             entity_id: vendorId,
    //         },
    //         userId,
    //     );

    //     // Update vendor review count
    //     const reviewStats = await this.reviewService.getStats('vendor', vendorId);
    //     await this.vendorModel.update(
    //         { total_reviews: reviewStats.approved_reviews },
    //         { where: { id: vendorId } },
    //     );

    //     return review;
    // }

    // async addRating(vendorId: number, ratingDto: any, userId: number) {
    //     const rating = await this.ratingService.create(
    //         {
    //             ...ratingDto,
    //             entity_type: 'vendor',
    //             entity_id: vendorId,
    //         },
    //         userId,
    //     );

    //     // Update vendor rating
    //     const ratingStats = await this.ratingService.getStats('vendor', vendorId);
    //     await this.vendorModel.update(
    //         {
    //             rating_average: ratingStats.average_rating,
    //             total_ratings: ratingStats.total_ratings,
    //         },
    //         { where: { id: vendorId } },
    //     );

    //     return rating;
    // }

    // async getUserRating(vendorId: number, userId: number) {
    //     return await this.ratingService.findByUser('vendor', vendorId, userId);
    // }

    // async getUserReview(vendorId: number, userId: number) {
    //     return await this.reviewService.getUserReview('vendor', vendorId, userId);
    // }
}

// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/sequelize';
// import { Vendor } from './models/vendor.model';
// import { MediaService } from '../shared/media/media.service';
// import { ReviewService } from '../shared/review/review.service';
// import { RatingService } from '../shared/rating/rating.service';
// import { MediaType } from '../shared/media/models/media-type.enum';
// import { CreateMediaDto } from '../shared/media/dto/create-media.dto';

// @Injectable()
// export class VendorService {
//   constructor(
//     @InjectModel(Vendor)
//     private vendorModel: typeof Vendor,
//     private mediaService: MediaService,
//     private reviewService: ReviewService,
//     private ratingService: RatingService,
//   ) {}

//   async findOne(id: number) {
//     const vendor = await this.vendorModel.findByPk(id);
//     if (!vendor) {
//       throw new Error('Vendor not found');
//     }

//     // Get media
//     const logo = await this.mediaService.getPrimary('vendor', id);
//     const gallery = await this.mediaService.getGallery('vendor', id);
//     const mediaStats = await this.mediaService.getStats('vendor', id);

//     // Get reviews
//     const reviews = await this.reviewService.findAll({
//       entity_type: 'vendor',
//       entity_id: id,
//       is_approved: true,
//       limit: 10,
//     });

//     // Get rating stats
//     const ratingStats = await this.ratingService.getStats('vendor', id);

//     return {
//       ...vendor.toJSON(),
//       logo,
//       gallery,
//       mediaStats,
//       reviews: reviews.data,
//       ratingStats,
//     };
//   }

//   async addMedia(vendorId: number, files: any[], userId: number) {
//     const mediaDtos: CreateMediaDto[] = files.map((file, index) => ({
//       url: file.url,
//       key: file.key,
//       thumbnail_url: file.thumbnail_url,
//       medium_url: file.medium_url,
//       type: MediaType.VENDOR_GALLERY,
//       entity_type: 'vendor',
//       entity_id: vendorId,
//       sort_order: index,
//       file_size: file.size,
//       mime_type: file.mimetype,
//     }));

//     return await this.mediaService.createMultiple(mediaDtos, userId);
//   }

//   async addReview(vendorId: number, reviewDto: any, userId: number) {
//     const review = await this.reviewService.create({
//       ...reviewDto,
//       entity_type: 'vendor',
//       entity_id: vendorId,
//     }, userId);

//     // Update vendor review count
//     const reviewStats = await this.reviewService.getStats('vendor', vendorId);
//     await this.vendorModel.update(
//       { total_reviews: reviewStats.approved_reviews },
//       { where: { id: vendorId } }
//     );

//     return review;
//   }

//   async addRating(vendorId: number, ratingDto: any, userId: number) {
//     const rating = await this.ratingService.create({
//       ...ratingDto,
//       entity_type: 'vendor',
//       entity_id: vendorId,
//     }, userId);

//     // Update vendor rating
//     const ratingStats = await this.ratingService.getStats('vendor', vendorId);
//     await this.vendorModel.update(
//       {
//         rating_average: ratingStats.average_rating,
//         total_ratings: ratingStats.total_ratings,
//       },
//       { where: { id: vendorId } }
//     );

//     return rating;
//   }

//   async getUserRating(vendorId: number, userId: number) {
//     return await this.ratingService.findByUser('vendor', vendorId, userId);
//   }

//   async getUserReview(vendorId: number, userId: number) {
//     return await this.reviewService.getUserReview('vendor', vendorId, userId);
//   }
// }
