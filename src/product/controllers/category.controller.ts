import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { Category } from '../entities/category.entity';
import { DeleteResult } from 'typeorm';


@Controller('category')
export class CategoryController {
  constructor(private readonly productService: ProductService) {}

  //CRUD CATEGORY
  @Post('')
  createCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<Category>{
    return this.productService.createCategory(createCategoryDto);
  }

  @Get('')
  getAllCategories(@Query('page') page: string, @Query('limit') limit: string): Promise<[Category[],number]>{
    return this.productService.getAllCategories(page,limit);
  }

  @Get(':id')
  getCategoryById(@Param('id') categoryId: string): Promise<Category>{
    return this.productService.getCategoryById(categoryId);
  }

  @Patch(':id')
  updateCategory(@Param('id') categoryId: string, updateCategoryDto: UpdateCategoryDto): Promise<Category>{
    return this.productService.updateCategory(categoryId,updateCategoryDto);
  }

  @Delete(':id')
  deleteCategory(@Param('id') categoryId: string): Promise<DeleteResult> {
    return this.productService.deleteCategory(categoryId);
  }


}