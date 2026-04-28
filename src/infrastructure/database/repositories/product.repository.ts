import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
    AttributeModel,
    AttributeValueModel,
    DiscountModel,
    InventoryModel,
    MediaModel,
    ProductAttributeValueModel,
    ProductModel,
    ProductVariantAttributeValueModel,
    ProductVariantModel,
    ReviewModel,
    SectionModel,
    StoreModel,
    TagModel,
    VendorModel,
} from 'src/infrastructure';
import { BaseRepository } from './base.repository';
import {
    MediaEntityTypeEnum,
    MediaTypeEnum,
    ProductStatusEnum,
    TagTypeEnum,
} from 'src/shared/enums';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class ProductRepository extends BaseRepository<ProductModel> {
    constructor(
        @InjectModel(ProductModel)
        private productModel: typeof ProductModel,
        @InjectModel(ProductVariantModel)
        private productVariantModel: typeof ProductVariantModel,
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
                        `(base_price < compare_at_price OR compare_at_price IS NOT NULL)`,
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
                        `((compare_at_price - base_price) / compare_at_price * 100)`,
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
                order = [['base_price', 'ASC']];
                break;
            case 'price_desc':
                order = [['base_price', 'DESC']];
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

    async findProductDetails(
        productId?: number,
        storeId?: number,
        slug?: string,
    ): Promise<ProductModel | null> {
        const where: any = {
            is_active: true,
            // status: 'published',
        };

        if (productId) where.id = productId;
        if (slug) where.slug = slug;
        if (storeId) where.store_id = storeId;

        // Phase 1: product
        const product = await this.productModel.findOne({
            where,
            attributes: { exclude: ['deleted_at', 'search_keywords'] },
            include: [
                { model: StoreModel, attributes: ['id', 'name', 'slug'] },
                { model: VendorModel, attributes: ['id', 'business_name', 'slug'] },
                { model: SectionModel, attributes: ['id', 'name', 'slug'] },
                {
                    model: MediaModel,
                    as: 'gallery_images',
                    where: {
                        entity_type: MediaEntityTypeEnum.PRODUCT,
                        type: MediaTypeEnum.PRODUCT_IMAGE,
                    },
                    required: false,
                },
            ],
        });
        if (!product) return null;

        // Phase 2: variants
        const variants = await this.productVariantModel.findAll({
            where: {
                product_id: product.id,
                // status: 'active',
            },
            include: [
                { model: InventoryModel },
                {
                    model: MediaModel,
                    as: 'gallery',
                    where: { entity_type: MediaEntityTypeEnum.PRODUCT_VARIANT },
                    required: false,
                },
                {
                    model: ProductVariantAttributeValueModel,
                    as: 'attribute_values',
                    include: [
                        { model: AttributeModel, as: 'attribute' },
                        { model: AttributeValueModel, as: 'attribute_value' },
                    ],
                },
            ],
            order: [['id', 'ASC']],
        });
        // console.log('Variants for product', product.id, variants);
        product.setDataValue('variants', variants);

        return product;
    }

    /**
     * Get product by slug (for SEO-friendly URLs)
     */
    async findBySlug(
        slug: string,
        storeId: number | null = null,
    ): Promise<ProductModel | null> {
        return this.findProductDetails(null, storeId, slug);
    }

    /**
     * Find product with variants optimized for quick view/preview
     */
    async findProductPreview(productId: number): Promise<ProductModel | null> {
        return this.productModel.findOne({
            where: {
                id: productId,
                is_active: true,
            },
            attributes: [
                'id',
                'name',
                'slug',
                'base_price',
                'min_variant_price',
                'max_variant_price',
                'product_type',
                'thumbnail_url',
            ],
            include: [
                {
                    model: ProductVariantModel,
                    as: 'variants',
                    where: { status: 'active' },
                    required: false,
                    attributes: ['id', 'sku', 'price', 'variant_name'],
                    include: [
                        {
                            model: ProductVariantAttributeValueModel,
                            include: [
                                {
                                    model: AttributeModel,
                                    attributes: ['code'],
                                },
                                {
                                    model: AttributeValueModel,
                                    attributes: ['value', 'display_value'],
                                },
                            ],
                        },
                    ],
                },
                {
                    model: MediaModel,
                    as: 'featured_image',
                    attributes: ['url', 'thumbnail_url'],
                },
            ],
        });
    }

    /**
     * Get variant details with inventory for add-to-cart
     */
    async findVariantForCart(
        variantId: number,
    ): Promise<ProductVariantModel | null> {
        return ProductVariantModel.findOne({
            where: {
                id: variantId,
                status: 'active',
            },
            include: [
                {
                    model: ProductModel,
                    attributes: ['id', 'name', 'slug', 'product_type', 'is_taxable'],
                },
                {
                    model: InventoryModel,
                    attributes: [
                        'stock_quantity',
                        'quantity',
                        'reserved_quantity',
                        'stock_status',
                        'allow_backorders',
                    ],
                },
                {
                    model: ProductVariantAttributeValueModel,
                    include: [
                        {
                            model: AttributeModel,
                            attributes: ['name', 'code'],
                        },
                        {
                            model: AttributeValueModel,
                            attributes: ['value', 'display_value'],
                        },
                    ],
                },
            ],
        });
    }

    async findByVendorId(vendorId: number) {
        return this.model.findAndCountAll({
            where: {
                vendor_id: vendorId,
            },
            include: [
                {
                    model: VendorModel,
                    as: 'vendor',
                    attributes: ['id', 'business_name', 'total_ratings', 'is_verified'],
                    where: {
                        id: vendorId,
                    },
                },
                {
                    model: StoreModel,
                    as: 'store',
                    attributes: ['id', 'name', 'description', 'slug'],

                },
                {
                    model: ProductVariantModel,
                    as: 'variants',
                    include: [
                        {
                            model: ProductVariantAttributeValueModel,
                            as: 'attribute_values',
                            include: [
                                { model: AttributeModel, as: 'attribute' },
                                { model: AttributeValueModel, as: 'attribute_value' },
                            ],
                        },
                    ]

                },
                { model: InventoryModel },
                {
                    model: MediaModel,
                    as: 'gallery_images',
                    where: { entity_type: MediaEntityTypeEnum.PRODUCT },
                    required: false,
                },
                {
                    model: MediaModel,
                    as: 'featured_image',
                    where: { is_primary: true, entity_type: MediaEntityTypeEnum.PRODUCT },
                    required: false,
                },

            ]
        })
    }

    async findOneByVendorId(vendorId: number, productId: number) {
        return this.model.findOne({
            where: {
                id: productId,
                vendor_id: vendorId,
            },
            include: [
                {
                    model: VendorModel,
                    as: 'vendor',
                    attributes: ['id', 'business_name', 'total_ratings', 'is_verified'],
                    where: {
                        id: vendorId,
                    },
                },
                {
                    model: StoreModel,
                    as: 'store',
                    attributes: ['id', 'name', 'description', 'slug'],

                },
                {
                    model: ProductVariantModel,
                    as: 'variants',
                    include: [
                        {
                            model: ProductVariantAttributeValueModel,
                            as: 'attribute_values',
                            include: [
                                { model: AttributeModel, as: 'attribute' },
                                { model: AttributeValueModel, as: 'attribute_value' },
                            ],
                        },
                    ]

                },
                { model: InventoryModel },
                {
                    model: MediaModel,
                    as: 'gallery_images',
                    where: { entity_type: MediaEntityTypeEnum.PRODUCT },
                    required: false,
                },
                {
                    model: MediaModel,
                    as: 'featured_image',
                    where: { is_primary: true, entity_type: MediaEntityTypeEnum.PRODUCT },
                    required: false,
                },

            ]
        })
    }
}
