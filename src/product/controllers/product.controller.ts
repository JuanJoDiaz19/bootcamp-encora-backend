import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../entities/product.entity';
import { DeleteResult } from 'typeorm';
import { InfoProductDto } from '../dto/info-product.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // CRUD PRODUCTS
  @Post()
  @UseInterceptors(FilesInterceptor('product_images'))
  create(@Body() createProductDto: CreateProductDto, @UploadedFiles() product_images: Array<Express.Multer.File>): Promise<Product> {
    return this.productService.createProduct(createProductDto, product_images);
  }

  //Retorna todos los productos que se encuentran activos
  @Get('active')
  getActiveProducts(@Query('page') page: string, @Query('limit') limit: string): Promise<[Product[], number]> {
    return this.productService.getActiveProducts(page,limit);
  }

  //Retorna todos los productos que se encuentran activos con filtrado de atributos por dto
  @Get('info/active')
  async getInfoActiveProducts(@Query('page') page: string, @Query('limit') limit: string): Promise<[InfoProductDto[], number]> {
    const [products, total] = await this.productService.getActiveProducts(page, limit);
    const infoProducts: InfoProductDto[] = products.map(product => new InfoProductDto(product));
    return [infoProducts, total];
  }

  //Retorna todos los productos
  @Get()
  findAll(@Query('page') page: string, @Query('limit') limit: string): Promise<[Product[], number]> {
    return this.productService.getAllProducts(page,limit);
  }

  //Retorna todos los productos con filtrado de atributos por dto
  @Get('info')
  async findAllInfo(@Query('page') page: string, @Query('limit') limit: string): Promise<[InfoProductDto[], number]> {
    const [products, total] = await this.productService.getAllProducts(page, limit);
    const infoProducts: InfoProductDto[] = products.map(product => new InfoProductDto(product));
    return [infoProducts, total];
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Product> {
    return this.productService.getProductById(id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('product_images'))
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @UploadedFiles() product_images: Array<Express.Multer.File>) {
    return this.productService.updateProduct(id, updateProductDto, product_images);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.productService.removeProduct(id);
  }

  // FILTERS
  @Get('filter/category/:name')
  getProductsByCategory(@Param('name') category: string, @Query('page') page: string, @Query('limit') limit: string):Promise<[Product[], number]>{
    return this.productService.getProductsByCategory(category, page, limit);
  }

  @Get('filter/search')
  searchProducts(@Query('keyword') keyword: string, @Query('page') page: string, @Query('limit') limit: string): Promise<[Product[], number]>{
    return this.productService.searchProducts(keyword,page,limit);
  }

  @Get('filter/group/:name')
  getProductsByGroup(@Param('name') groupName: string, @Query('page') page: string, @Query('limit') limit: string):Promise<[Product[],number]>{
    return this.productService.getProductsByGroup(groupName, page, limit);
  }

  @Get('filter/price/:order')
  getProductsSortedByPrice(@Param('order') order: 'ASC' | 'DESC', @Query('page') page: string, @Query('limit') limit: string):Promise<[Product[],number]>{
    return this.productService.getProductsSortedByPrice(order,page,limit);
  }

  /*@Get('filter/rating/:order')
  getProductsSortedByRating(@Param('order') order: 'ASC' | 'DESC', @Query('page') page: string, @Query('limit') limit: string):Promise<[Product[],number]>{
    return this.productService.getProductsSortedByRating(order,page,limit);
  }*/

  @Get('filter/sold_units/:order')
  getProductsSortedBySoldUnits(@Param('order') order: 'ASC' | 'DESC', @Query('page') page: string, @Query('limit') limit: string):Promise<[Product[],number]>{
    return this.productService.getProductsSortedBySoldUnits(order,page,limit);
  }

}