// services/product.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from 'src/infrastructure/database/repositories';
import {
    CreateProductDto,
    ProductResponseDto,
    ProductQueryDto,
    ProductListResponseDto,
    ProductFilterType,
    UpdateProductDto,
    SortOrder,
} from './dto';
import { ProductFormat } from './product-format.abstract';

import { PaginationService } from 'src/shared';

@Injectable()
export class ProductService extends ProductFormat {
    constructor(
        private readonly productRepository: ProductRepository,
        private _paginationService: PaginationService,
    ) {
        super();
    }

    // ==================== UNIFIED PRODUCT QUERY METHOD ====================

    async getProducts(query: ProductQueryDto): Promise<ProductListResponseDto> {
        const {
            search,
            categoryId,
            vendorId,
            storeId,
            filter,
            sortBy = 'created_at',
            sortOrder = 'DESC',
            page = 1,
            limit = 20,
            fields,
            minPrice,
            maxPrice,
            minRating,
            inStock,
            include,
        } = query;

        // Build filter conditions
        const where: any = {
            status: 'published',
            is_active: true,
        };

        // Apply pre-defined filters
        this.applyFilterConditions(where, filter);

        // Apply search
        if (search) {
            where.search = search;
        }

        // Apply category filter
        if (categoryId) {
            where.section_id = categoryId;
        }

        // Apply vendor filter
        if (vendorId) {
            where.vendor_id = vendorId;
        }

        // Apply store filter
        if (storeId) {
            where.store_id = storeId;
        }

        // Apply price range
        if (minPrice !== undefined || maxPrice !== undefined) {
            where.priceRange = { min: minPrice, max: maxPrice };
        }

        // Apply rating filter
        if (minRating) {
            where.minRating = minRating;
        }

        // Apply stock filter
        // if (inStock !== undefined) {
        //     where.inStock = inStock;
        // }

        // Parse fields selection
        const selectedFields = fields?.split(',').map((f) => f.trim()) || [];

        // Parse include relations
        const includeRelations = include?.split(',').map((f) => f.trim()) || [];

        // Execute query
        const { rows, count } =
            await this.productRepository.findProductsWithFilters({
                where,
                sortBy,
                sortOrder,
                limit,
                offset: (page - 1) * limit,
                fields: selectedFields,
                include: includeRelations,
            });

        const totalPages = Math.ceil(count / limit);

        // Format response with field selection
        const items = rows.map((product) => this.formatProductResponse(product));

        return {
            items,
            meta: {
                currentPage: page,
                totalPages,
                totalItems: count,
                itemsPerPage: limit,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            },
            filters: {
                appliedFilters: {
                    ...(search && { search }),
                    ...(categoryId && { categoryId }),
                    ...(vendorId && { vendorId }),
                    ...(storeId && { storeId }),
                    ...(filter && { filter }),
                    ...(minPrice && { minPrice }),
                    ...(maxPrice && { maxPrice }),
                    ...(minRating && { minRating }),
                    ...(inStock !== undefined && { inStock }),
                },
            },
            ...(search && { searchTerm: search }),
        };
    }

    // ==================== FILTER HELPER METHODS ====================

    private applyFilterConditions(where: any, filter?: ProductFilterType): void {
        if (!filter) return;

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        switch (filter) {
            case ProductFilterType.FLASH_DEALS:
                where.flashDeals = true;
                break;
            case ProductFilterType.BEST_SELLERS:
                where.bestSellers = true;
                break;
            case ProductFilterType.MOST_POPULAR:
                where.mostPopular = true;
                break;
            case ProductFilterType.TOP_RATED:
                where.topRated = true;
                break;
            case ProductFilterType.NEW_ARRIVALS:
                where.newArrivals = { since: thirtyDaysAgo };
                break;
            case ProductFilterType.FEATURED:
                where.isFeatured = true;
                break;
        }
    }

    // ==================== INDIVIDUAL PRODUCT METHODS ====================

    async getProductById(
        id: number,
        include?: string,
    ): Promise<ProductResponseDto> {
        const includeRelations = include?.split(',').map((f) => f.trim()) || [];

        const product = await this.productRepository.findProductDetails(id, {
            include: includeRelations,
        });

        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        await this.productRepository.incrementViews(id);
        return this.formatProductResponse(product);
    }

    async getProductBySlug(
        slug: string,
        include?: string,
    ): Promise<ProductResponseDto> {
        const includeRelations = include?.split(',').map((f) => f.trim()) || [];

        const product = await this.productRepository.findBySlug(slug, {
            include: includeRelations,
        });

        if (!product) {
            throw new NotFoundException(`Product with slug "${slug}" not found`);
        }

        await this.productRepository.incrementViews(product.id);
        return this.formatProductResponse(product);
    }

    // ==================== CRUD OPERATIONS ====================

    async createProduct(
        createProductDto: CreateProductDto,
    ): Promise<ProductResponseDto> {
        const product = await this.productRepository.create(createProductDto);
        return this.getProductById(product.id);
    }

    async updateProduct(
        id: number,
        updateProductDto: UpdateProductDto,
    ): Promise<ProductResponseDto> {
        const [affectedCount] = await this.productRepository.update(
            id,
            updateProductDto,
        );

        if (affectedCount === 0) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        return this.getProductById(id);
    }

    async deleteProduct(id: number): Promise<void> {
        const deletedCount = await this.productRepository.deleteById(id);
        if (deletedCount === 0) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
    }
}
