import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { Group } from './entities/group.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { DeleteResult } from 'typeorm';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // CRUD PRODUCTS
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
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.productService.removeProduct(id);
  }

  // FILTERS
  @Get('category/:name')
  getProductsByCategory(@Param('name') category: string, @Query('page') page: string, @Query('limit') limit: string):Promise<[Product[], number]>{
    return this.productService.getProductsByCategory(category, page, limit);
  }

  @Get('search')
  searchProducts(@Query('keyword') keyword: string, @Query('page') page: string, @Query('limit') limit: string): Promise<[Product[], number]>{
    return this.productService.searchProducts(keyword,page,limit);
  }

  //CRUD CATEGORY
  @Post('category')
  createCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<Category>{
    return this.productService.createCategory(createCategoryDto);
  }

  @Get('category')
  getAllCategories(@Query('page') page: string, @Query('limit') limit: string): Promise<[Category[],number]>{
    return this.productService.getAllCategories(page,limit);
  }

  @Get('category/:name')
  getCategoryByName(@Param('name') categoryName: string): Promise<Category>{
    return this.productService.getCategoryByName(categoryName);
  }

  @Patch('category/:name')
  updateCategory(@Param('name') categoryName: string, updateCategoryDto: UpdateCategoryDto): Promise<Category>{
    return this.productService.updateCategory(categoryName,updateCategoryDto);
  }

  @Delete('category/:name')
  deleteCategory(@Param('name') categoryName: string): Promise<DeleteResult> {
    return this.productService.deleteCategory(categoryName);
  }

  //CRUD GROUPS
  @Post('group')
  createGroup(@Body() createGroupDto: CreateGroupDto): Promise<Group>{
    return this.productService.createGroup(createGroupDto);
  }

  @Get('group')
  getAllGroups(): Promise<Category[]>{
    return this.productService.getAllGroups();
  }

  @Get('group/:name')
  getGroupByName(@Param('name') groupName: string): Promise<Category>{
    return this.productService.getGroupByName(groupName);
  }

  @Patch('group/:name')
  updateGroup(@Param('name') groupName: string, updateGroupDto: UpdateGroupDto): Promise<Category>{
    return this.productService.updateGroup(groupName, updateGroupDto);
  }

  @Delete('group/:name')
  deleteGroup(@Param('name') groupName: string): Promise<Category>{
    return this.productService.deleteGroup(groupName);
  }


}