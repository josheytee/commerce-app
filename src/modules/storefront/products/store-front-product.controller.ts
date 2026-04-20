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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProductService } from './products.service';
import { ProductResponseDto } from './dto/product-response.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { IndexPageResponseDto } from './dto/index-page-response.dto';


@ApiTags('StoreFront - Products')
@Controller('products')
export class StoreFrontProductController {
  constructor(private readonly productService: ProductService) { }

  // ==================== PUBLIC ENDPOINTS ====================

  // @Get('index')
  // @ApiOperation({
  //   summary: 'Get all products for index page',
  //   description:
  //     'Returns flash deals, best sellers, most popular, top rated, new arrivals, and featured products in one request',
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Index page data retrieved successfully',
  //   type: IndexPageResponseDto,
  // })
  // async getIndexPageProducts(): Promise<IndexPageResponseDto> {
  //   return this.productService.getIndexPageProducts();
  // }

  @Get('flash-deals')
  @ApiOperation({ summary: 'Get flash deals products' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Flash deals retrieved successfully',
    type: [ProductResponseDto],
  })
  async getFlashDeals(
    @Query('limit') limit?: number,
  ): Promise<ProductResponseDto[]> {
    return this.productService.getFlashDeals(limit || 10);
  }

  @Get('best-sellers')
  @ApiOperation({ summary: 'Get best selling products' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 8 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Best sellers retrieved successfully',
    type: [ProductResponseDto],
  })
  async getBestSellers(
    @Query('limit') limit?: number,
  ): Promise<ProductResponseDto[]> {
    return this.productService.getBestSellers(limit || 8);
  }

  @Get('most-popular')
  @ApiOperation({
    summary: 'Get most popular products based on views and sales',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 8 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Most popular products retrieved successfully',
    type: [ProductResponseDto],
  })
  async getMostPopular(
    @Query('limit') limit?: number,
  ): Promise<ProductResponseDto[]> {
    return this.productService.getMostPopular(limit || 8);
  }

  @Get('top-rated')
  @ApiOperation({ summary: 'Get top rated products based on customer reviews' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 8 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Top rated products retrieved successfully',
    type: [ProductResponseDto],
  })
  async getTopRated(
    @Query('limit') limit?: number,
  ): Promise<ProductResponseDto[]> {
    return this.productService.getTopRated(limit || 8);
  }

  @Get('new-arrivals')
  @ApiOperation({ summary: 'Get newly added products (last 30 days)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 8 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'New arrivals retrieved successfully',
    type: [ProductResponseDto],
  })
  async getNewArrivals(
    @Query('limit') limit?: number,
  ): Promise<ProductResponseDto[]> {
    return this.productService.getNewArrivals(limit || 8);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured products' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 6 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Featured products retrieved successfully',
    type: [ProductResponseDto],
  })
  async getFeaturedProducts(
    @Query('limit') limit?: number,
  ): Promise<ProductResponseDto[]> {
    return this.productService.getFeaturedProducts(limit || 6);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search products by keyword' })
  @ApiQuery({
    name: 'q',
    required: true,
    type: String,
    description: 'Search query',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Search results retrieved successfully',
  })
  async searchProducts(
    @Query('q') query: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.productService.searchProducts(query, page || 1, limit || 20);
  }

  @Get('category/:categoryId')
  @ApiOperation({
    summary: 'Get products by category with sorting and pagination',
  })
  @ApiParam({
    name: 'categoryId',
    type: Number,
    description: 'Category/Section ID',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    enum: ['newest', 'popular', 'price_asc', 'price_desc', 'rating'],
    example: 'newest',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Category products retrieved successfully',
  })
  async getProductsByCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Query('sort') sort?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.productService.getProductsByCategory(categoryId, {
      sort,
      page: page || 1,
      limit: limit || 20,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single product by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Product ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product retrieved successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  async getProductById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProductResponseDto> {
    return this.productService.getProductById(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get a single product by slug' })
  @ApiParam({ name: 'slug', type: String, description: 'Product slug' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product retrieved successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  async getProductBySlug(
    @Param('slug') slug: string,
  ): Promise<ProductResponseDto> {
    return this.productService.getProductBySlug(slug);
  }
}
