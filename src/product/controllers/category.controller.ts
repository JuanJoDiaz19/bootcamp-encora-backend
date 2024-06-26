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
  UploadedFile,
} from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { Category } from '../entities/category.entity';
import { DeleteResult } from 'typeorm';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('category')
export class CategoryController {
  constructor(private readonly productService: ProductService) {}

  //CRUD CATEGORY
  @Post('')
  @UseInterceptors(FileInterceptor('category_image'))
  createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() category_image: Express.Multer.File,
  ): Promise<Category> {
    return this.productService.createCategory(
      createCategoryDto,
      category_image,
    );
  }

  @Get('')
  getAllCategories(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<[Category[], number]> {
    return this.productService.getAllCategories(page, limit);
  }

  @Get(':name')
  getCategoryByName(@Param('name') categoryName: string): Promise<Category> {
    return this.productService.getCategoryByName(categoryName);
  }

  // @Get(':id')
  // getCategoryById(@Param('id') categoryId: string): Promise<Category> {
  //   return this.productService.getCategoryById(categoryId);
  // }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('category_image'))
  updateCategory(
    @Param('id') categoryId: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile() category_image: Express.Multer.File,
  ): Promise<Category> {
    return this.productService.updateCategory(
      categoryId,
      updateCategoryDto,
      category_image,
    );
  }

  @Delete(':id')
  deleteCategory(@Param('id') categoryId: string): Promise<DeleteResult> {
    return this.productService.deleteCategory(categoryId);
  }
}
