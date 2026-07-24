// repositories/product.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import {
    ProductModel,
    ProductVariantModel,
    VendorModel,
    StoreModel,
    SectionModel,
    MediaModel,
    ReviewModel,
    InventoryModel,
    ProductVariantAttributeValueModel,
    AttributeModel,
    AttributeValueModel,
} from 'src/infrastructure';
import { BaseRepository } from './base.repository';
import {
    MediaEntityTypeEnum,
    MediaTypeEnum,
    ProductStatusEnum,
} from 'src/shared/enums';

interface ProductFilterOptions {
    where?: any;
    sortBy?: string;
    sortOrder?: string;
    limit?: number;
    offset?: number;
    fields?: string[];
    include?: string[];
}

@Injectable()
export class ProductRepository extends BaseRepository<ProductModel> {
    constructor(
        @InjectModel(ProductModel)
        private productModel: typeof ProductModel,
        // @InjectModel(ProductVariantModel)
        // private productVariantModel: typeof ProductVariantModel,
    ) {
        super(productModel);
    }

    // ==================== ADVANCED PRODUCT QUERY ====================

    async findProductsWithFilters(
        options: ProductFilterOptions,
    ): Promise<{ rows: ProductModel[]; count: number }> {
        const { where, sortBy, sortOrder, limit, offset, fields, include } =
            options;

        // Build WHERE clause
        const whereClause = this.buildWhereClause(where);

        // Build ORDER clause
        const orderClause = this.buildOrderClause(sortBy, sortOrder);

        // Build SELECT clause (field selection)
        const attributes = this.buildSelectClause(fields);

        // Build INCLUDE clause (relations)
        const includeClause = this.buildIncludeClause(include);

        return this.productModel.findAndCountAll({
            where: whereClause,
            attributes,
            order: orderClause,
            limit,
            offset,
            include: includeClause,
            distinct: true,
            subQuery: false,
        });
    }

    // ==================== WHERE CLAUSE BUILDER ====================

    private buildWhereClause(conditions: any): any {
        const where: any = {
            deleted_at: null,
            status: ProductStatusEnum.PUBLISHED,
            is_active: true,
        };

        // Search
        if (conditions.search) {
            where[Op.or] = [
                { name: { [Op.iLike]: `%${conditions.search}%` } },
                { description: { [Op.iLike]: `%${conditions.search}%` } },
                { short_description: { [Op.iLike]: `%${conditions.search}%` } },
                { meta_keywords: { [Op.iLike]: `%${conditions.search}%` } },
            ];
        }

        // Category
        if (conditions.section_id) {
            where.section_id = conditions.section_id;
        }

        // Vendor
        if (conditions.vendor_id) {
            where.vendor_id = conditions.vendor_id;
        }

        // Store
        if (conditions.store_id) {
            where.store_id = conditions.store_id;
        }

        // Featured
        if (conditions.isFeatured) {
            where.is_featured = true;
        }

        // Flash Deals
        if (conditions.flashDeals) {
            where[Op.and] = [
                { compare_at_price: { [Op.ne]: null } },
                Sequelize.literal(
                    '"ProductModel"."base_price" < "ProductModel"."compare_at_price"',
                ),
            ];
        }

        // Best Sellers
        if (conditions.bestSellers) {
            // No additional where needed, just order by sales_count
        }

        // Most Popular
        if (conditions.mostPopular) {
            // No additional where needed, just order by views and sales
        }

        // Top Rated
        if (conditions.topRated) {
            // No additional where needed, just order by total_ratings
        }

        // New Arrivals
        if (conditions.newArrivals) {
            where.created_at = { [Op.gte]: conditions.newArrivals.since };
        }

        // Price Range
        if (conditions.priceRange) {
            const { min, max } = conditions.priceRange;
            if (min !== undefined && max !== undefined) {
                where.base_price = { [Op.between]: [min, max] };
            } else if (min !== undefined) {
                where.base_price = { [Op.gte]: min };
            } else if (max !== undefined) {
                where.base_price = { [Op.lte]: max };
            }
        }

        // Min Rating
        if (conditions.minRating) {
            where.total_ratings = { [Op.gte]: conditions.minRating };
        }

        // In Stock
        // if (conditions.inStock !== undefined) {
        //     // This requires a subquery or join with inventory
        //     where.inStock = conditions.inStock;
        // }

        return where;
    }

    // ==================== ORDER CLAUSE BUILDER ====================

    private buildOrderClause(sortBy?: string, sortOrder?: string): any[] {
        const order: any[] = [];

        // Map sort field to database column
        const sortFieldMap = {
            name: 'name',
            base_price: 'base_price',
            created_at: 'created_at',
            sales_count: 'sales_count',
            views: 'views',
            rating: 'total_ratings',
            total_ratings: 'total_ratings',
        };

        const field = sortFieldMap[sortBy] || 'created_at';
        const direction = sortOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        // Special handling for certain sorts
        if (sortBy === 'rating') {
            // For rating, we might want to order by average rating
            order.push([
                Sequelize.literal(`total_ratings / NULLIF(total_reviews, 0)`),
                direction,
            ]);
        } else if (sortBy === 'mostPopular') {
            order.push(['views', 'DESC']);
            order.push(['sales_count', 'DESC']);
        } else {
            order.push([field, direction]);
        }

        // Always add secondary sort
        if (sortBy !== 'created_at') {
            order.push(['created_at', 'DESC']);
        }

        return order;
    }

    // ==================== SELECT CLAUSE BUILDER ====================

    private buildSelectClause(fields?: string[]): any {
        if (!fields || fields.length === 0) {
            // Exclude heavy fields by default
            return {
                exclude: ['deleted_at', 'search_keywords', 'description_full'],
            };
        }

        // Map field names to database columns
        const fieldMap = {
            id: 'id',
            name: 'name',
            slug: 'slug',
            description: 'description',
            shortDescription: 'short_description',
            basePrice: 'base_price',
            compareAtPrice: 'compare_at_price',
            minVariantPrice: 'min_variant_price',
            maxVariantPrice: 'max_variant_price',
            productType: 'product_type',
            isActive: 'is_active',
            isFeatured: 'is_featured',
            isTaxable: 'is_taxable',
            status: 'status',
            views: 'views',
            salesCount: 'sales_count',
            totalRatings: 'total_ratings',
            totalReviews: 'total_reviews',
            thumbnailUrl: 'thumbnail_url',
            metaTitle: 'meta_title',
            metaDescription: 'meta_description',
            metaKeywords: 'meta_keywords',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        };

        const selected = fields.map((f) => fieldMap[f] || f).filter(Boolean);

        return selected.length > 0 ? selected : undefined;
    }

    // ==================== INCLUDE CLAUSE BUILDER ====================

    private buildIncludeClause(include?: string[]): any[] {
        if (!include || include.length === 0) {
            // Default includes (lightweight)
            return [
                {
                    model: VendorModel,
                    as: 'vendor',
                    attributes: ['id', 'business_name', 'total_ratings', 'is_verified'],
                },
                {
                    model: SectionModel,
                    as: 'section',
                    attributes: ['id', 'name', 'slug'],
                },
            ];
        }

        const includes: any[] = [];

        // Map include names to Sequelize include configurations
        const includeMap = {
            vendor: {
                model: VendorModel,
                as: 'vendor',
                attributes: ['id', 'business_name', 'total_ratings', 'is_verified'],
            },
            store: {
                model: StoreModel,
                as: 'store',
                attributes: ['id', 'name', 'description', 'slug'],
            },
            section: {
                model: SectionModel,
                as: 'section',
                attributes: ['id', 'name', 'slug'],
            },
            gallery: {
                model: MediaModel,
                as: 'gallery_images',
                where: {
                    entity_type: MediaEntityTypeEnum.PRODUCT,
                    type: MediaTypeEnum.PRODUCT_IMAGE,
                },
                required: false,
                attributes: ['id', 'url', 'thumbnail_url', 'caption'],
            },
            featuredImage: {
                model: MediaModel,
                as: 'featured_image',
                where: {
                    is_primary: true,
                    entity_type: MediaEntityTypeEnum.PRODUCT,
                },
                required: false,
                attributes: ['id', 'url', 'thumbnail_url'],
            },
            variants: {
                model: ProductVariantModel,
                as: 'variants',
                required: false,
                include: [
                    {
                        model: InventoryModel,
                        attributes: [
                            'stock_quantity',
                            'quantity',
                            'reserved_quantity',
                            'stock_status',
                        ],
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
            },
            reviews: {
                model: ReviewModel,
                as: 'reviews',
                required: false,
                limit: 5,
                order: [['created_at', 'DESC']],
            },
        };

        // Add requested includes
        include.forEach((name) => {
            const includeConfig = includeMap[name];
            if (includeConfig) {
                includes.push(includeConfig);
            }
        });

        return includes;
    }

    // ==================== EXISTING METHODS (Updated) ====================

    async findProductDetails(
        id: number,
        options?: { include?: string[] },
    ): Promise<ProductModel | null> {
        const include = this.buildIncludeClause(
            options?.include.length
                ? options.include
                : ['vendor', 'store', 'section', 'gallery', 'variants'],
        );
        return this.productModel.findOne({
            where: {
                id,
                status: ProductStatusEnum.PUBLISHED,
                is_active: true,
                deleted_at: null,
            },
            include,
        });
    }

    async findBySlug(
        slug: string,
        options?: { include?: string[] },
    ): Promise<ProductModel | null> {
        const include = this.buildIncludeClause(
            options?.include.length
                ? options.include
                : ['vendor', 'store', 'section', 'gallery', 'variants'],
        );

        return this.productModel.findOne({
            where: {
                slug,
                status: ProductStatusEnum.PUBLISHED,
                is_active: true,
                deleted_at: null,
            },
            include,
        });
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
                    model: SectionModel,
                    as: 'section',
                    attributes: ['id', 'name', 'slug'],
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
                    ],
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
            ],
        });
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
                    ],
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
            ],
        });
    }

    async findByStoreId(storeId: number) {
        return this.model.findAndCountAll({
            where: {
                store_id: storeId,
            },
            include: [
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
                    ],
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
            ],
        });
    }

    async findOneByStoreId(storeId: number, productId: number) {
        return this.model.findOne({
            where: {
                id: productId,
                store_id: storeId,
            },
            include: [
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
                    ],
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
            ],
        });
    }
}
