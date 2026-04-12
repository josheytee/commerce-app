// services/product.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from 'src/infrastructure/database/repositories';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { ProductModel } from 'src/infrastructure';
import { IndexPageResponseDto } from './dto/index-page-response.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
    constructor(private readonly productRepository: ProductRepository) { }

    private formatProductResponse(product: ProductModel): ProductResponseDto {
        const compareAtPrice = product.compare_at_price || product.price;
        const discountPercentage = product.compare_at_price
            ? Math.round(
                ((product.compare_at_price - product.price) /
                    product.compare_at_price) *
                100,
            )
            : 0;

        const featuredImage =
            product.gallery_images?.find((img) => img.is_primary)?.url ||
            product.gallery_images?.[0]?.url ||
            null;

        const galleryImages = product.gallery_images?.map((img) => img.url) || [];

        const averageRating = product.reviews?.length
            ? product.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
            product.reviews.length
            : 0;

        return {
            id: product.id,
            name: product.name,
            slug: product.slug,
            description: product.description,
            short_description: product.short_description,
            price: Number(product.price),
            compare_at_price: product.compare_at_price
                ? Number(product.compare_at_price)
                : undefined,
            cost_price: product.cost_price ? Number(product.cost_price) : undefined,
            formatted_price: product.formatted_price,
            discount_percentage: discountPercentage,
            final_price: product.compare_at_price ? Number(product.price) : undefined,
            // sku: product.sku,
            status: product.status,
            product_type: product.product_type,
            is_featured: product.is_featured,
            is_active: product.is_active,
            rating: Math.round(averageRating * 10) / 10,
            review_count: product.reviews?.length || 0,
            // sales_count: product.sales_count || 0,
            // stock_quantity: product.stock_quantity || 0,
            featured_image: featuredImage,
            gallery_images: galleryImages,
            category: product.section
                ? {
                    id: product.section.id,
                    name: product.section.name,
                    slug: product.section.slug,
                }
                : null,
            vendor: product.vendor
                ? {
                    id: product.vendor.id,
                    name: product.vendor.business_name,
                    rating: product.vendor.rating_average || 0,
                    verified: product.vendor.is_verified || false,
                }
                : null,
            recent_reviews: product.reviews?.slice(0, 5).map((review) => ({
                rating: review.rating,
                comment: review.content,
            })),
            created_at: product.created_at,
            updated_at: product.updated_at,
        };
    }

    async getIndexPageProducts(): Promise<IndexPageResponseDto> {
        const [
            flashDeals,
            bestSellers,
            mostPopular,
            topRated,
            newArrivals,
            featuredProducts,
        ] = await Promise.all([
            this.productRepository.findFlashDeals(10),
            this.productRepository.findBestSellers(8),
            this.productRepository.findMostPopular(8),
            this.productRepository.findTopRated(8),
            this.productRepository.findNewArrivals(8),
            this.productRepository.findFeaturedProducts(6),
        ]);

        return {
            flashDeals: flashDeals.map((product) => ({
                ...this.formatProductResponse(product),
                flash_deal_ends_at: product.available_to,
                discount: product.compare_at_price
                    ? Math.round(
                        ((product.compare_at_price - product.price) /
                            product.compare_at_price) *
                        100,
                    )
                    : 0,
            })),
            bestSellers: bestSellers.map((product) =>
                this.formatProductResponse(product),
            ),
            mostPopular: mostPopular.map((product) =>
                this.formatProductResponse(product),
            ),
            topRated: topRated.map((product) => this.formatProductResponse(product)),
            newArrivals: newArrivals.map((product) =>
                this.formatProductResponse(product),
            ),
            featuredProducts: featuredProducts.map((product) =>
                this.formatProductResponse(product),
            ),
        };
    }

    async getFlashDeals(limit: number = 10): Promise<ProductResponseDto[]> {
        const products = await this.productRepository.findFlashDeals(limit);
        return products.map((product) => this.formatProductResponse(product));
    }

    async getBestSellers(limit: number = 8): Promise<ProductResponseDto[]> {
        const products = await this.productRepository.findBestSellers(limit);
        return products.map((product) => this.formatProductResponse(product));
    }

    async getMostPopular(limit: number = 8): Promise<ProductResponseDto[]> {
        const products = await this.productRepository.findMostPopular(limit);
        return products.map((product) => this.formatProductResponse(product));
    }

    async getTopRated(limit: number = 8): Promise<ProductResponseDto[]> {
        const products = await this.productRepository.findTopRated(limit);
        return products.map((product) => this.formatProductResponse(product));
    }

    async getNewArrivals(limit: number = 8): Promise<ProductResponseDto[]> {
        const products = await this.productRepository.findNewArrivals(limit);
        return products.map((product) => this.formatProductResponse(product));
    }

    async getFeaturedProducts(limit: number = 6): Promise<ProductResponseDto[]> {
        const products = await this.productRepository.findFeaturedProducts(limit);
        return products.map((product) => this.formatProductResponse(product));
    }

    async getProductById(id: number): Promise<ProductResponseDto> {
        const product = await this.productRepository.findById(id);
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        // Increment view count
        await this.productRepository.incrementViews(id);

        return this.formatProductResponse(product);
    }

    async getProductBySlug(slug: string): Promise<ProductResponseDto> {
        const product = await this.productRepository.findBySlug(slug);
        if (!product) {
            throw new NotFoundException(`Product with slug "${slug}" not found`);
        }

        await this.productRepository.incrementViews(product.id);

        return this.formatProductResponse(product);
    }

    async getProductsByCategory(
        categoryId: number,
        options: { sort?: string; page?: number; limit?: number },
    ): Promise<{ items: ProductResponseDto[]; meta: any }> {
        const page = options.page || 1;
        const limit = options.limit || 20;
        const offset = (page - 1) * limit;

        const { rows, count } = await this.productRepository.findByCategory(
            categoryId,
            {
                sort: options.sort,
                limit,
                offset,
            },
        );

        return {
            items: rows.map((product) => this.formatProductResponse(product)),
            meta: {
                currentPage: page,
                totalPages: Math.ceil(count / limit),
                totalItems: count,
                itemsPerPage: limit,
            },
        };
    }

    async searchProducts(
        query: string,
        page: number = 1,
        limit: number = 20,
    ): Promise<{ items: ProductResponseDto[]; meta: any; searchTerm: string }> {
        const offset = (page - 1) * limit;

        const { rows, count } = await this.productRepository.searchProducts(query, {
            limit,
            offset,
        });

        return {
            items: rows.map((product) => this.formatProductResponse(product)),
            searchTerm: query,
            meta: {
                currentPage: page,
                totalPages: Math.ceil(count / limit),
                totalItems: count,
                itemsPerPage: limit,
            },
        };
    }

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
        const [affectedCount, updatedProducts] =
            await this.productRepository.update(id, updateProductDto);

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
