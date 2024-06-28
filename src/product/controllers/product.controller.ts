import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../entities/product.entity';
import { DeleteResult } from 'typeorm';
import { InfoProductDto } from '../dto/info-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // CRUD PRODUCTS
  @Post()
  @UseInterceptors(FilesInterceptor('product_images'))
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully.', type: Product })
  @ApiBody({ type: CreateProductDto })
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() product_images: Array<Express.Multer.File>,
  ): Promise<Product> {
    return this.productService.createProduct(createProductDto, product_images);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active products' })
  @ApiResponse({ status: 200, description: 'List of active products', type: [Product] })
  @ApiQuery({ name: 'page', required: false, type: String, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: String, description: 'Limit number of products per page' })
  getActiveProducts(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<[Product[], number]> {
    return this.productService.getActiveProducts(page, limit);
  }

  @Get('info/active')
  @ApiOperation({ summary: 'Get active products with filtered attributes' })
  @ApiResponse({ status: 200, description: 'List of active products with filtered attributes', type: [InfoProductDto] })
  @ApiQuery({ name: 'page', required: false, type: String, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: String, description: 'Limit number of products per page' })
  async getInfoActiveProducts(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<[InfoProductDto[], number]> {
    const [products, total] = await this.productService.getActiveProducts(page, limit);
    const infoProducts: InfoProductDto[] = products.map(
      (product) => new InfoProductDto(product),
    );
    return [infoProducts, total];
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'List of all products', type: [Product] })
  @ApiQuery({ name: 'page', required: false, type: String, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: String, description: 'Limit number of products per page' })
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<[Product[], number]> {
    return this.productService.getAllProducts(page, limit);
  }

  @Get('info')
  @ApiOperation({ summary: 'Get all products with filtered attributes' })
  @ApiResponse({ status: 200, description: 'List of all products with filtered attributes', type: [InfoProductDto] })
  @ApiQuery({ name: 'page', required: false, type: String, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: String, description: 'Limit number of products per page' })
  async findAllInfo(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<[InfoProductDto[], number]> {
    const [products, total] = await this.productService.getAllProducts(page, limit);
    const infoProducts: InfoProductDto[] = products.map(
      (product) => new InfoProductDto(product),
    );
    return [infoProducts, total];
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({ status: 200, description: 'Product found', type: Product })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the product' })
  findOne(@Param('id') id: string): Promise<Product> {
    return this.productService.getProductById(id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('product_images'))
  @ApiOperation({ summary: 'Update product' })
  @ApiResponse({ status: 200, description: 'Product updated successfully.', type: Product })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the product' })
  @ApiBody({ type: UpdateProductDto })
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() product_images: Array<Express.Multer.File>,
  ): Promise<Product> {
    return this.productService.updateProduct(id, updateProductDto, product_images);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully.', type: DeleteResult })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the product' })
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.productService.removeProduct(id);
  }

  // FILTERS
  @Get('filter/category/:name')
  @ApiOperation({ summary: 'Get products by category' })
  @ApiResponse({ status: 200, description: 'List of products by category', type: [Product] })
  @ApiParam({ name: 'name', type: String, description: 'Name of the category' })
  @ApiQuery({ name: 'page', required: false, type: String, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: String, description: 'Limit number of products per page' })
  getProductsByCategory(
    @Param('name') category: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<[Product[], number]> {
    return this.productService.getProductsByCategory(category, page, limit);
  }

  @Get('filter/search')
  @ApiOperation({ summary: 'Search products' })
  @ApiResponse({ status: 200, description: 'List of products by search keyword', type: [Product] })
  @ApiQuery({ name: 'keyword', required: true, type: String, description: 'Search keyword' })
  @ApiQuery({ name: 'page', required: false, type: String, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: String, description: 'Limit number of products per page' })
  searchProducts(
    @Query('keyword') keyword: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<[Product[], number]> {
    return this.productService.searchProducts(keyword, page, limit);
  }

  @Get('filter/group/:name')
  @ApiOperation({ summary: 'Get products by group' })
  @ApiResponse({ status: 200, description: 'List of products by group', type: [Product] })
  @ApiParam({ name: 'name', type: String, description: 'Name of the group' })
  @ApiQuery({ name: 'page', required: false, type: String, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: String, description: 'Limit number of products per page' })
  getProductsByGroup(
    @Param('name') groupName: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<[Product[], number]> {
    return this.productService.getProductsByGroup(groupName, page, limit);
  }

  @Get('filter/price/:order')
  @ApiOperation({ summary: 'Get products sorted by price' })
  @ApiResponse({ status: 200, description: 'List of products sorted by price', type: [Product] })
  @ApiParam({ name: 'order', type: String, description: 'Order direction (ASC or DESC)' })
  @ApiQuery({ name: 'page', required: false, type: String, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: String, description: 'Limit number of products per page' })
  getProductsSortedByPrice(
    @Param('order') order: 'ASC' | 'DESC',
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<[Product[], number]> {
    return this.productService.getProductsSortedByPrice(order, page, limit);
  }

  @Get('filter/rating/:order')
  @ApiOperation({ summary: 'Get products sorted by rating' })
  @ApiResponse({ status: 200, description: 'List of products sorted by rating', type: [Product] })
  @ApiParam({ name: 'order', type: String, description: 'Order direction (ASC or DESC)' })
  @ApiQuery({ name: 'page', required: false, type: String, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: String, description: 'Limit number of products per page' })
  getProductsSortedByRating(
    @Param('order') order: 'ASC' | 'DESC',
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<[Product[], number]> {
    return this.productService.getProductsSortedByRating(order, page, limit);
  }

  @Get('filter/sold_units/:order')
  @ApiOperation({ summary: 'Get products sorted by sold units' })
  @ApiResponse({ status: 200, description: 'List of products sorted by sold units', type: [Product] })
  @ApiParam({ name: 'order', type: String, description: 'Order direction (ASC or DESC)' })
  @ApiQuery({ name: 'page', required: false, type: String, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: String, description: 'Limit number of products per page' })
  getProductsSortedBySoldUnits(
    @Param('order') order: 'ASC' | 'DESC',
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<[Product[], number]> {
    return this.productService.getProductsSortedBySoldUnits(order, page, limit);
  }

  @Get('filter/price/:order/category/:categoryId')
  @ApiOperation({ summary: 'Get products sorted by price for category' })
  @ApiResponse({ status: 200, description: 'List of products sorted by price for category', type: [Product] })
  @ApiParam({ name: 'order', type: String, description: 'Order direction (ASC or DESC)' })
  @ApiParam({ name: 'categoryId', type: String, description: 'ID of the category' })
  @ApiQuery({ name: 'page', required: false, type: String, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: String, description: 'Limit number of products per page' })
  getProductsSortedByPriceForCategory(
    @Param('categoryId') categoryId: string,
    @Param('order') order: 'ASC' | 'DESC',
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<[Product[], number]> {
    return this.productService.getProductsSortedByPriceForCategory(
      categoryId,
      order,
      page,
      limit,
    );
  }

  @Get('filter/rating/:order/category/:categoryId')
  @ApiOperation({ summary: 'Get products sorted by rating for category' })
  @ApiResponse({ status: 200, description: 'List of products sorted by rating for category', type: [Product] })
  @ApiParam({ name: 'order', type: String, description: 'Order direction (ASC or DESC)' })
  @ApiParam({ name: 'categoryId', type: String, description: 'ID of the category' })
  @ApiQuery({ name: 'page', required: false, type: String, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: String, description: 'Limit number of products per page' })
  getProductsSortedByRatingForCategory(
    @Param('categoryId') categoryId: string,
    @Param('order') order: 'ASC' | 'DESC',
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<[Product[], number]> {
    return this.productService.getProductsSortedByRatingForCategory(
      categoryId,
      order,
      page,
      limit,
    );
  }

  @Get('filter/sold_units/:order/category/:categoryId')
  @ApiOperation({ summary: 'Get products sorted by sold units for category' })
  @ApiResponse({ status: 200, description: 'List of products sorted by sold units for category', type: [Product] })
  @ApiParam({ name: 'order', type: String, description: 'Order direction (ASC or DESC)' })
  @ApiParam({ name: 'categoryId', type: String, description: 'ID of the category' })
  @ApiQuery({ name: 'page', required: false, type: String, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: String, description: 'Limit number of products per page' })
  getProductsSortedBySoldUnitsForCategory(
    @Param('categoryId') categoryId: string,
    @Param('order') order: 'ASC' | 'DESC',
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<[Product[], number]> {
    return this.productService.getProductsSortedBySoldUnitsForCategory(
      categoryId,
      order,
      page,
      limit,
    );
  }

  @Get('filter/price/:order/group/:groupId')
  @ApiOperation({ summary: 'Get products sorted by price for group' })
  @ApiResponse({ status: 200, description: 'List of products sorted by price for group', type: [Product] })
  @ApiParam({ name: 'order', type: String, description: 'Order direction (ASC or DESC)' })
  @ApiParam({ name: 'groupId', type: String, description: 'ID of the group' })
  @ApiQuery({ name: 'page', required: false, type: String, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: String, description: 'Limit number of products per page' })
  getProductsSortedByPriceForGroup(
    @Param('groupId') groupId: string,
    @Param('order') order: 'ASC' | 'DESC',
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<[Product[], number]> {
    return this.productService.getProductsSortedByPriceForGroup(
      groupId,
      order,
      page,
      limit,
    );
  }

  @Get('filter/rating/:order/group/:groupId')
  @ApiOperation({ summary: 'Get products sorted by rating for group' })
  @ApiResponse({ status: 200, description: 'List of products sorted by rating for group', type: [Product] })
  @ApiParam({ name: 'order', type: String, description: 'Order direction (ASC or DESC)' })
  @ApiParam({ name: 'groupId', type: String, description: 'ID of the group' })
  @ApiQuery({ name: 'page', required: false, type: String, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: String, description: 'Limit number of products per page' })
  getProductsSortedByRatingForGroup(
    @Param('groupId') groupId: string,
    @Param('order') order: 'ASC' | 'DESC',
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<[Product[], number]> {
    return this.productService.getProductsSortedByRatingForGroup(
      groupId,
      order,
      page,
      limit,
    );
  }

  @Get('filter/sold_units/:order/group/:groupId')
  @ApiOperation({ summary: 'Get products sorted by sold units for group' })
  @ApiResponse({ status: 200, description: 'List of products sorted by sold units for group', type: [Product] })
  @ApiParam({ name: 'order', type: String, description: 'Order direction (ASC or DESC)' })
  @ApiParam({ name: 'groupId', type: String, description: 'ID of the group' })
  @ApiQuery({ name: 'page', required: false, type: String, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: String, description: 'Limit number of products per page' })
  getProductsSortedBySoldUnitsForGroup(
    @Param('groupId') groupId: string,
    @Param('order') order: 'ASC' | 'DESC',
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<[Product[], number]> {
    return this.productService.getProductsSortedBySoldUnitsForGroup(
      groupId,
      order,
      page,
      limit,
    );
  }
}
