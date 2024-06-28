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
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly productService: ProductService) {}

  // CRUD CATEGORY
  @Post('')
  @UseInterceptors(FileInterceptor('category_image'))
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, description: 'Category created successfully.', type: Category })
  @ApiBody({ type: CreateCategoryDto })
  createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() category_image: Express.Multer.File,
  ): Promise<Category> {
    return this.productService.createCategory(createCategoryDto, category_image);
  }

  @Get('')
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'List of categories', type: [Category] })
  @ApiQuery({ name: 'page', required: false, type: String, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: String, description: 'Limit number of categories per page' })
  getAllCategories(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<[Category[], number]> {
    return this.productService.getAllCategories(page, limit);
  }

  @Get(':name')
  @ApiOperation({ summary: 'Get category by name' })
  @ApiResponse({ status: 200, description: 'Category found', type: Category })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiParam({ name: 'name', type: String, description: 'Name of the category' })
  getCategoryByName(@Param('name') categoryName: string): Promise<Category> {
    return this.productService.getCategoryByName(categoryName);
  }

  @Get('/id/:id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiResponse({ status: 200, description: 'Category found', type: Category })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the category' })
  getCategoryById(@Param('id') categoryId: string): Promise<Category> {
    return this.productService.getCategoryById(categoryId);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('category_image'))
  @ApiOperation({ summary: 'Update category' })
  @ApiResponse({ status: 200, description: 'Category updated successfully.', type: Category })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the category' })
  @ApiBody({ type: UpdateCategoryDto })
  updateCategory(
    @Param('id') categoryId: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile() category_image: Express.Multer.File,
  ): Promise<Category> {
    return this.productService.updateCategory(categoryId, updateCategoryDto, category_image);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete category' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully.', type: DeleteResult })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the category' })
  deleteCategory(@Param('id') categoryId: string): Promise<DeleteResult> {
    return this.productService.deleteCategory(categoryId);
  }
}
