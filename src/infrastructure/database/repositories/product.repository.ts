import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
    MediaModel,
    ProductModel,
    ReviewModel,
    SectionModel,
    StoreModel,
    VendorModel,
} from 'src/infrastructure';
import { BaseRepository } from './base.repository';
import { MediaTypeEnum, ProductStatusEnum } from 'src/shared/enums';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class ProductRepository extends BaseRepository<ProductModel> {
    constructor(
        @InjectModel(ProductModel)
        private productModel: typeof ProductModel,
    ) {
        super(productModel);
    }

    async findByStore(
        storeId: number,
        vendorId: number,
    ): Promise<ProductModel[]> {
        if (!storeId || !vendorId) return [];

        return this.findAll({
            where: { store_id: storeId },
        });
    }

    async findOneByStore(
        storeId: number,
        sectionId: number,
    ): Promise<ProductModel | null> {
        return this.findOne({
            where: { id: sectionId, store_id: storeId },
        });
    }

    async findAllWithRelationships(options?: {
        where?: any;
        include?: any[];
        order?: any[];
        limit?: number;
        offset?: number;
    }): Promise<{ rows: ProductModel[]; count: number }> {
        const { where, include, order, limit, offset } = options || {};

        return this.productModel.findAndCountAll({
            where: { ...where, deleted_at: null },
            include: include || [
                {
                    model: SectionModel,
                    as: 'section',
                    attributes: ['id', 'name', 'slug'],
                },
                {
                    model: StoreModel,
                    as: 'store',
                    attributes: ['id', 'name', 'slug'],
                },
                {
                    model: VendorModel,
                    as: 'vendor',
                    attributes: ['id', 'business_name', 'total_ratings', 'is_verified'],
                },
            ],
            order: order || [['created_at', 'DESC']],
            limit,
            offset,
            distinct: true,
        });
    }

    async findByIdR(id: number): Promise<ProductModel | null> {
        return this.productModel.findByPk(id, {
            include: [
                {
                    model: SectionModel,
                    as: 'section',
                    attributes: ['id', 'name', 'slug'],
                },
                {
                    model: StoreModel,
                    as: 'store',
                    attributes: ['id', 'name', 'slug'],
                },
                {
                    model: VendorModel,
                    as: 'vendor',
                    attributes: ['id', 'business_name', 'total_ratings', 'is_verified'],
                },
                {
                    model: MediaModel,
                    as: 'gallery_images',
                    where: { entity_type: 'product', type: MediaTypeEnum.PRODUCT_IMAGE },
                    required: false,
                },
                {
                    model: ReviewModel,
                    as: 'reviews',
                    required: false,
                    limit: 5,
                    order: [['created_at', 'DESC']],
                },
            ],
        });
    }

    async findBySlug(slug: string): Promise<ProductModel | null> {
        return this.productModel.findOne({
            where: { slug, deleted_at: null },
            include: [
                {
                    model: SectionModel,
                    as: 'section',
                    attributes: ['id', 'name', 'slug'],
                },
                {
                    model: StoreModel,
                    as: 'store',
                    attributes: ['id', 'name', 'slug'],
                },
                {
                    model: VendorModel,
                    as: 'vendor',
                    attributes: ['id', 'business_name', 'total_ratings', 'is_verified'],
                },
                {
                    model: MediaModel,
                    as: 'gallery_images',
                    where: { entity_type: 'product', type: MediaTypeEnum.PRODUCT_IMAGE },
                    required: false,
                },
            ],
        });
    }

    async findFlashDeals(limit: number = 10): Promise<ProductModel[]> {
        return this.productModel.findAll({
            where: {
                status: ProductStatusEnum.PUBLISHED,
                is_active: true,
                [Op.or]: [
                    { compare_at_price: { [Op.ne]: null } },
                    { is_featured: true },
                ],
                [Op.and]: Sequelize.where(
                    Sequelize.literal(
                        `(price < compare_at_price OR compare_at_price IS NOT NULL)`,
                    ),
                    true,
                ),
            },
            include: [
                {
                    model: SectionModel,
                    as: 'section',
                    attributes: ['id', 'name', 'slug'],
                },
                {
                    model: VendorModel,
                    as: 'vendor',
                    attributes: ['id', 'business_name', 'total_ratings', 'is_verified'],
                },
            ],
            order: [
                [
                    Sequelize.literal(
                        `((compare_at_price - price) / compare_at_price * 100)`,
                    ),
                    'DESC',
                ],
            ],
            limit,
        });
    }

    async findBestSellers(limit: number = 8): Promise<ProductModel[]> {
        return this.productModel.findAll({
            where: {
                status: ProductStatusEnum.PUBLISHED,
                is_active: true,
            },
            include: [
                {
                    model: SectionModel,
                    as: 'section',
                    attributes: ['id', 'name', 'slug'],
                },
                {
                    model: VendorModel,
                    as: 'vendor',
                    attributes: ['id', 'business_name', 'total_ratings', 'is_verified'],
                },
            ],
            order: [['sales_count', 'DESC']],
            limit,
        });
    }

    async findMostPopular(limit: number = 8): Promise<ProductModel[]> {
        return this.productModel.findAll({
            where: {
                status: ProductStatusEnum.PUBLISHED,
                is_active: true,
            },
            include: [
                {
                    model: SectionModel,
                    as: 'section',
                    attributes: ['id', 'name', 'slug'],
                },
                {
                    model: VendorModel,
                    as: 'vendor',
                    attributes: ['id', 'business_name', 'total_ratings', 'is_verified'],
                },
            ],
            order: [
                ['views', 'DESC'],
                ['sales_count', 'DESC'],
            ],
            limit,
        });
    }

    async findTopRated(limit: number = 8): Promise<ProductModel[]> {
        return this.productModel.findAll({
            where: {
                status: ProductStatusEnum.PUBLISHED,
                is_active: true,
            },
            include: [
                {
                    model: SectionModel,
                    as: 'section',
                    attributes: ['id', 'name', 'slug'],
                },
                {
                    model: VendorModel,
                    as: 'vendor',
                    attributes: ['id', 'business_name', 'total_ratings', 'is_verified'],
                },
                {
                    model: ReviewModel,
                    as: 'reviews',
                    required: false,
                    attributes: ['rating'],
                },
            ],
            order: [['total_ratings', 'DESC']],
            limit,
        });
    }

    async findNewArrivals(limit: number = 8): Promise<ProductModel[]> {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        return this.productModel.findAll({
            where: {
                status: ProductStatusEnum.PUBLISHED,
                is_active: true,
                created_at: { [Op.gte]: thirtyDaysAgo },
            },
            include: [
                {
                    model: SectionModel,
                    as: 'section',
                    attributes: ['id', 'name', 'slug'],
                },
                {
                    model: VendorModel,
                    as: 'vendor',
                    attributes: ['id', 'business_name', 'total_ratings', 'is_verified'],
                },
            ],
            order: [['created_at', 'DESC']],
            limit,
        });
    }

    async findFeaturedProducts(limit: number = 6): Promise<ProductModel[]> {
        return this.productModel.findAll({
            where: {
                status: ProductStatusEnum.PUBLISHED,
                is_active: true,
                is_featured: true,
            },
            include: [
                {
                    model: SectionModel,
                    as: 'section',
                    attributes: ['id', 'name', 'slug'],
                },
                {
                    model: VendorModel,
                    as: 'vendor',
                    attributes: ['id', 'business_name', 'total_ratings', 'is_verified'],
                },
            ],
            order: [['created_at', 'ASC']],
            limit,
        });
    }

    async findByCategory(
        categoryId: number,
        options: {
            sort?: string;
            limit?: number;
            offset?: number;
        },
    ): Promise<{ rows: ProductModel[]; count: number }> {
        const { sort, limit, offset } = options;

        let order = [];
        switch (sort) {
            case 'price_asc':
                order = [['price', 'ASC']];
                break;
            case 'price_desc':
                order = [['price', 'DESC']];
                break;
            case 'rating':
                order = [['rating', 'DESC']];
                break;
            case 'newest':
                order = [['created_at', 'DESC']];
                break;
            case 'popular':
                order = [['sales_count', 'DESC']];
                break;
            default:
                order = [['created_at', 'DESC']];
        }

        return this.productModel.findAndCountAll({
            where: {
                section_id: categoryId,
                status: ProductStatusEnum.PUBLISHED,
                is_active: true,
            },
            include: [
                {
                    model: VendorModel,
                    as: 'vendor',
                    attributes: ['id', 'business_name', 'total_ratings', 'is_verified'],
                },
            ],
            order,
            limit,
            offset,
            distinct: true,
        });
    }

    async searchProducts(
        query: string,
        options: {
            limit?: number;
            offset?: number;
        },
    ): Promise<{ rows: ProductModel[]; count: number }> {
        const { limit, offset } = options;

        return this.productModel.findAndCountAll({
            where: {
                [Op.or]: [
                    { name: { [Op.iLike]: `%${query}%` } },
                    { description: { [Op.iLike]: `%${query}%` } },
                    { short_description: { [Op.iLike]: `%${query}%` } },
                    { meta_keywords: { [Op.iLike]: `%${query}%` } },
                ],
                status: ProductStatusEnum.PUBLISHED,
                is_active: true,
            },
            include: [
                {
                    model: SectionModel,
                    as: 'section',
                    attributes: ['id', 'name', 'slug'],
                },
                {
                    model: VendorModel,
                    as: 'vendor',
                    attributes: ['id', 'business_name', 'total_ratings', 'is_verified'],
                },
            ],
            order: [['sales_count', 'DESC']],
            limit,
            offset,
            distinct: true,
        });
    }

    async incrementViews(id: number): Promise<void> {
        await this.productModel.increment(['views'], { by: 1, where: { id } });
    }

    async incrementSales(id: number, quantity: number = 1): Promise<void> {
        await this.productModel.increment('sales_count', {
            by: quantity,
            where: { id },
        });
    }
}
