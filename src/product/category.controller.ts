import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
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

  @Get(':name')
  getCategoryByName(@Param('name') categoryName: string): Promise<Category>{
    return this.productService.getCategoryByName(categoryName);
  }

  @Patch(':name')
  updateCategory(@Param('name') categoryName: string, updateCategoryDto: UpdateCategoryDto): Promise<Category>{
    return this.productService.updateCategory(categoryName,updateCategoryDto);
  }

  @Delete(':name')
  deleteCategory(@Param('name') categoryName: string): Promise<DeleteResult> {
    return this.productService.deleteCategory(categoryName);
  }


}