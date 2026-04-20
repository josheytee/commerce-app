// services/product.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from 'src/infrastructure/database/repositories';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { ProductModel } from 'src/infrastructure';
import { IndexPageResponseDto } from './dto/index-page-response.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFormat } from './product-format.abstract';

@Injectable()
export class ProductService extends ProductFormat {
    constructor(private readonly productRepository: ProductRepository) {
        super();
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
                        ((product.compare_at_price - product.base_price) /
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
        const product = await this.productRepository.findProductDetails(id);
        // console.log('Fetched product details for ID:', id, product);
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
