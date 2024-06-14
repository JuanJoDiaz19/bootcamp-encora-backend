import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.createProduct(createProductDto);
  }

  @Get()
  findAll(@Query('page') page: string, @Query('limit') limit: string): Promise<[Product[], number]> {
    return this.productService.getAllProducts(page,limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Product> {
    return this.productService.getProductById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.removeProduct(id);
  }

  @Post('category')
  createCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<Category>{
    return this.productService.createCategory(createCategoryDto);
  }

  @Get('category/:name')
  getProductsByCategory(@Param('name') category: string, @Query('page') page: string, @Query('limit') limit: string):Promise<[Product[], number]>{
    return this.productService.getProductsByCategory(category, page, limit);
  }

  @Get('search')
  searchProducts(@Query('keyword') keyword: string, @Query('page') page: string, @Query('limit') limit: string): Promise<[Product[], number]>{
    return this.productService.searchProducts(keyword,page,limit);
  }

}