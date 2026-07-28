// repositories/vendor.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from 'src/infrastructure/database/repositories/base.repository';
import {
    CategoryModel,
    MediaModel,
    StoreModel,
    UserModel,
    VendorModel,
} from 'src/infrastructure';
import { Op, Sequelize } from 'sequelize';
import {
    OrderRepository,
    MediaRepository,
} from 'src/infrastructure/database/repositories';
import {
    SortOrder,
    VendorFilterDto,
    VendorListResponseDto,
    VendorSortBy,
} from '../../../modules/vendor/onboarding/dto';

@Injectable()
export class VendorRepository extends BaseRepository<VendorModel> {
    constructor(
        @InjectModel(VendorModel)
        private vendorModel: typeof VendorModel,
        private mediaRepository: MediaRepository,
        private _orderRepository: OrderRepository,
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

    async findVendorsWithFilters(
        filters: VendorFilterDto,
    ): Promise<VendorListResponseDto> {
        const {
            page = 1,
            limit = 10,
            search,
            status,
            categoryId,
            userId,
            isVerified,
            isFeatured,
            sortBy = VendorSortBy.CREATED_AT,
            sortOrder = SortOrder.DESC,
            minRating,
            maxRating,
            minReviews,
            startDate,
            endDate,
            hasStores,
            hasOrders,
            bestSellers,
            mostActive,
            newVendors,
            featured,
        } = filters;

        // Build where clause
        const where: any = {};

        // Status filter
        if (userId) {
            where.user_id = userId;
        }
        // Status filter
        if (status) {
            where.status = status;
        }

        // Category filter
        if (categoryId) {
            where.category_id = categoryId;
        }

        // Verification filter
        if (isVerified !== undefined) {
            where.is_verified = isVerified;
        }

        // Featured filter
        if (isFeatured !== undefined) {
            where.is_featured = isFeatured;
        }

        // Search filter
        if (search) {
            const searchTerm = `%${search}%`;
            where[Op.or] = [
                { business_name: { [Op.iLike]: searchTerm } },
                { business_email: { [Op.iLike]: searchTerm } },
                { business_phone: { [Op.iLike]: searchTerm } },
                { slug: { [Op.iLike]: searchTerm } },
                { business_description: { [Op.iLike]: searchTerm } },
                { business_short_description: { [Op.iLike]: searchTerm } },
            ];
        }

        // Rating range filter
        if (minRating !== undefined || maxRating !== undefined) {
            where.rating_average = {};
            if (minRating !== undefined) {
                where.rating_average[Op.gte] = minRating;
            }
            if (maxRating !== undefined) {
                where.rating_average[Op.lte] = maxRating;
            }
        }

        // Reviews count filter
        if (minReviews !== undefined) {
            where.total_reviews = { [Op.gte]: minReviews };
        }

        // Date range filter
        if (startDate || endDate) {
            where.created_at = {};
            if (startDate) {
                where.created_at[Op.gte] = new Date(startDate);
            }
            if (endDate) {
                where.created_at[Op.lte] = new Date(endDate);
            }
        }

        // New vendors filter (last 30 days)
        if (newVendors) {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            where.created_at = { [Op.gte]: thirtyDaysAgo };
        }

        // Build include array
        const include: any[] = [
            {
                model: CategoryModel,
                as: 'category',
                attributes: ['id', 'name', 'slug'],
            },
            {
                model: StoreModel,
                as: 'stores',
                required: false,
                attributes: ['id', 'name', 'slug', 'status', 'is_verified'],
            },
            {
                model: MediaModel,
                as: 'logo',
                required: false,
                attributes: ['id', 'url', 'thumbnail_url', 'alt_text'],
            },
            {
                model: MediaModel,
                as: 'cover_image',
                required: false,
                attributes: ['id', 'url', 'thumbnail_url', 'alt_text'],
            },
            {
                model: UserModel,
                as: 'user',
                attributes: ['id', 'first_name', 'last_name', 'email', 'phone_number'],
            },
        ];

        // Special filters that require subqueries
        if (hasStores !== undefined) {
            include.push({
                model: StoreModel,
                as: 'stores',
                required: hasStores,
                where: hasStores ? { status: 'active' } : {},
                attributes: ['id'],
            });
        }

        // Calculate pagination
        const offset = (page - 1) * limit;

        // Build order by clause
        let order: any = [[sortBy, sortOrder]];

        // Special sorting for numeric fields
        if (
            sortBy === VendorSortBy.RATING_AVERAGE ||
            sortBy === VendorSortBy.TOTAL_RATINGS ||
            sortBy === VendorSortBy.TOTAL_REVIEWS
        ) {
            order = [[Sequelize.literal(`CAST(${sortBy} AS DECIMAL)`), sortOrder]];
        }

        // Best sellers filter - vendors with highest orders
        if (bestSellers) {
            const orderCounts = await this._orderRepository.findAll({
                attributes: [
                    'vendor_id',
                    [Sequelize.fn('COUNT', Sequelize.col('vendor_id')), 'order_count'],
                ],
                where: { vendor_id: { [Op.ne]: null } },
                group: ['vendor_id'],
                order: [[Sequelize.literal('order_count'), 'DESC']],
                limit: 20,
            });

            const vendorIds = orderCounts.map((o: any) => o.vendor_id);
            if (vendorIds.length > 0) {
                where.id = { [Op.in]: vendorIds };
            } else {
                return {
                    data: [],
                    meta: {
                        total: 0,
                        page,
                        limit,
                        totalPages: 0,
                    },
                };
            }
        }

        // Most active vendors - recently updated
        if (mostActive) {
            order = [['updated_at', 'DESC']];
        }

        // Featured vendors
        if (featured) {
            where.is_featured = true;
        }

        // Execute main query
        const { rows, count } = await this.vendorModel.findAndCountAll({
            where,
            include,
            order,
            offset,
            limit: parseInt(limit.toString()),
            distinct: true,
            subQuery: false,
        });

        // Additional filter: hasOrders (requires separate query)
        if (hasOrders !== undefined && rows.length > 0) {
            const vendorIds = rows.map((v) => v.id);
            const orderCounts = await this._orderRepository.findAll({
                attributes: [
                    'vendor_id',
                    [Sequelize.fn('COUNT', Sequelize.col('vendor_id')), 'order_count'],
                ],
                where: {
                    vendor_id: { [Op.in]: vendorIds },
                },
                group: ['vendor_id'],
            });

            const vendorIdsWithOrders = orderCounts.map((o: any) => o.vendor_id);
            const filteredRows = hasOrders
                ? rows.filter((v) => vendorIdsWithOrders.includes(v.id))
                : rows.filter((v) => !vendorIdsWithOrders.includes(v.id));

            const totalPages = Math.ceil(filteredRows.length / limit);
            return {
                data: filteredRows,
                meta: {
                    total: filteredRows.length,
                    page,
                    limit,
                    totalPages,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1,
                },
            };
        }

        const totalPages = Math.ceil(count / limit);
        return {
            data: rows,
            meta: {
                total: count,
                page,
                limit,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        };
    }

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
            include: ['user', 'stores', 'users', 'orders'],
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

    async getVendorsById(ids: number[]): Promise<VendorModel[] | null> {
        return this.vendorModel.findAll({
            where: { id: ids },
            include: [
                {
                    model: StoreModel,
                    as: 'stores',
                    where: { status: 'active' },
                    required: false,
                },
            ],
        });
    }
}
