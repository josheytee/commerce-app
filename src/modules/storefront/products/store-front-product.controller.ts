// controllers/product.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiExtraModels,
} from '@nestjs/swagger';
import { ProductService } from './products.service';
import { ProductResponseDto } from './dto/product-response.dto';
import {
  ProductQueryDto,
  ProductListResponseDto,
  ProductFilterType,
} from './dto/product-query.dto';
import { ProductIncludeQueryDto } from './dto';

@ApiTags('StoreFront - Products')
@Controller('products')
@ApiExtraModels(ProductIncludeQueryDto) // Add this to make it visible in Swagger
export class StoreFrontProductController {
  constructor(private readonly productService: ProductService) { }

  // ==================== UNIFIED PRODUCT LIST ENDPOINT ====================

  @Get()
  @ApiOperation({
    summary: 'Get products with advanced filtering, sorting, and pagination',
    description:
      'Unified endpoint for all product listings. Use query parameters for filtering.',
  })
  @ApiOkResponse({
    description: 'Products retrieved successfully',
    type: ProductResponseDto,
    isArray: true,
  })
  async getProducts(
    @Query(new ValidationPipe({ transform: true })) query: ProductQueryDto,
  ): Promise<ProductListResponseDto> {
    return this.productService.getProducts(query);
  }

  // ==================== CONVENIENCE ENDPOINTS ====================

  @Get('flash-deals')
  @ApiOperation({ summary: 'Get flash deals products' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    description: 'Number of items to return',
  })
  @ApiOkResponse({
    description: 'Flash deals retrieved successfully',
    type: ProductResponseDto,
    isArray: true,
  })
  async getFlashDeals(
    @Query('limit') limit?: number,
  ): Promise<ProductListResponseDto> {
    const result = await this.productService.getProducts({
      filter: ProductFilterType.FLASH_DEALS,
      limit: limit || 10,
      page: 1,
    });
    return result;
  }

  @Get('best-sellers')
  @ApiOperation({ summary: 'Get best selling products' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 8,
    description: 'Number of items to return',
  })
  @ApiOkResponse({
    description: 'Best sellers retrieved successfully',
    type: ProductResponseDto,
    isArray: true,
  })
  async getBestSellers(
    @Query('limit') limit?: number,
  ): Promise<ProductResponseDto[]> {
    const result = await this.productService.getProducts({
      filter: ProductFilterType.BEST_SELLERS,
      limit: limit || 8,
      page: 1,
    });
    return result.items;
  }

  @Get('most-popular')
  @ApiOperation({
    summary: 'Get most popular products based on views and sales',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 8,
    description: 'Number of items to return',
  })
  @ApiOkResponse({
    description: 'Most popular products retrieved successfully',
    type: ProductResponseDto,
    isArray: true,
  })
  async getMostPopular(
    @Query('limit') limit?: number,
  ): Promise<ProductResponseDto[]> {
    const result = await this.productService.getProducts({
      filter: ProductFilterType.MOST_POPULAR,
      limit: limit || 8,
      page: 1,
    });
    return result.items;
  }

  @Get('top-rated')
  @ApiOperation({ summary: 'Get top rated products based on customer reviews' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 8,
    description: 'Number of items to return',
  })
  @ApiOkResponse({
    description: 'Top rated products retrieved successfully',
    type: ProductResponseDto,
    isArray: true,
  })
  async getTopRated(
    @Query('limit') limit?: number,
  ): Promise<ProductResponseDto[]> {
    const result = await this.productService.getProducts({
      filter: ProductFilterType.TOP_RATED,
      limit: limit || 8,
      page: 1,
    });
    return result.items;
  }

  @Get('new-arrivals')
  @ApiOperation({ summary: 'Get newly added products (last 30 days)' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 8,
    description: 'Number of items to return',
  })
  @ApiOkResponse({
    description: 'New arrivals retrieved successfully',
    type: ProductResponseDto,
    isArray: true,
  })
  async getNewArrivals(
    @Query('limit') limit?: number,
  ): Promise<ProductResponseDto[]> {
    const result = await this.productService.getProducts({
      filter: ProductFilterType.NEW_ARRIVALS,
      limit: limit || 8,
      page: 1,
    });
    return result.items;
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured products' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 6,
    description: 'Number of items to return',
  })
  @ApiOkResponse({
    description: 'Featured products retrieved successfully',
    type: ProductResponseDto,
    isArray: true,
  })
  async getFeaturedProducts(
    @Query('limit') limit?: number,
  ): Promise<ProductResponseDto[]> {
    const result = await this.productService.getProducts({
      filter: ProductFilterType.FEATURED,
      limit: limit || 6,
      page: 1,
    });
    return result.items;
  }

  // ==================== INDIVIDUAL PRODUCT ENDPOINTS ====================

  @Get(':id')
  @ApiOperation({
    summary: 'Get a single product by ID',
    description:
      'Retrieve a product by its ID with optional related data inclusion',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Product ID',
    example: 123,
  })
  @ApiQuery({
    name: 'include',
    required: false,
    type: String,
    description:
      'Comma-separated list of relations to include: variants,reviews,gallery,vendor,store,section,featuredImage',
    example: 'variants,reviews,gallery',
  })
  @ApiOkResponse({
    description: 'Product retrieved successfully',
    type: ProductResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Product with ID 123 not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  async getProductById(
    @Param('id', ParseIntPipe) id: number,
    @Query('include') include?: string,
  ): Promise<ProductResponseDto> {
    return this.productService.getProductById(id, include);
  }

  @Get('slug/:slug')
  @ApiOperation({
    summary: 'Get a single product by slug',
    description:
      'Retrieve a product by its SEO-friendly slug with optional related data inclusion',
  })
  @ApiParam({
    name: 'slug',
    type: String,
    description: 'Product slug',
    example: 'apple-iphone-15-pro-max',
  })
  @ApiQuery({
    name: 'include',
    required: false,
    type: String,
    description:
      'Comma-separated list of relations to include: variants,reviews,gallery,vendor,store,section,featuredImage',
    example: 'variants,reviews',
  })
  @ApiOkResponse({
    description: 'Product retrieved successfully',
    type: ProductResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: {
          type: 'string',
          example: 'Product with slug "apple-iphone-15-pro-max" not found',
        },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  async getProductBySlug(
    @Param('slug') slug: string,
    @Query('include') include?: string,
  ): Promise<ProductResponseDto> {
    return this.productService.getProductBySlug(slug, include);
  }
}
