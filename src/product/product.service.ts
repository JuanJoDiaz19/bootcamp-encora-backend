import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { Review } from './entities/review.entity';
import { Stock } from './entities/stock.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class ProductService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
  ){}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    try{
      const category: Category = await this.categoryRepository.findOne({where:{name: createProductDto.category}});

      if(!category){
        throw new Error("La categoria seleccionada no existe");
      }

      const stock = await this.createStock(createProductDto.stock);
  
      const newProduct = this.productRepository.create({
        ...createProductDto,
        category:category,
        stock,
      });
        
      return this.productRepository.save(newProduct);
    }catch(error){
      throw new BadRequestException(error.message);
    }

  }

  async getAllProducts(page: string, limit: string):Promise<Product[]> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    try {
      return await this.productRepository.find({
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber,
        relations: {
          category: true,
          stock:true,
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getProductById(id: string):Promise<Product> {
    try {
      const product = this.productRepository.findOne({where:{id}});
      if(!product){
        throw new Error(`El producto con ID: ${id} no existe`);
      }
      return product;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    try {
      const product = await this.getProductById(id);

      if(!product){
        throw new Error(`No es posible actualizar el libro con ID: ${id}, ya que no existe`);
      }
  
      const updateProduct = Object.assign(product, updateProductDto);
      return this.productRepository.save(updateProduct);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async removeProduct(id: string) {
    try {
      const product = this.getProductById(id);
      const result = await this.productRepository.delete(id);
      return result;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async createCategory(createCategoryDto:CreateCategoryDto): Promise<Category>{
    try {
      const categoryName = createCategoryDto.name;
      const category = this.categoryRepository.findOne({where:{name:categoryName}})
      if(category){
        throw Error(`La categoria con nombre: ${categoryName} ya existe`);
      }
      const newCategory = this.categoryRepository.create(createCategoryDto);
      return this.categoryRepository.save(newCategory);
    } catch (error) {
      throw new BadRequestException(error.message);
    } 
  }

  async createStock(stock:number): Promise<Stock>{
    const newStock = this.stockRepository.create({
      stock
    });

    return this.stockRepository.save(newStock);
  }

  async getProductsByCategory(category: string, page: string, limit: string): Promise<Product[]> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const products = await this.productRepository.find({
      where: { name: category }, 
      skip: (pageNumber - 1) * limitNumber, 
      take: limitNumber 
    });
    return products;

  }

}
