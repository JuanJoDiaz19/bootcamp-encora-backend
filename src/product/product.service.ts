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
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

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

  async getAllProducts(page: string, limit: string):Promise<[Product[], number]>{
    try {
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber <= 0 || limitNumber <= 0) {
        throw new Error('La pagina y el limite deben ser numeros positivos');
      }

      return await this.productRepository.findAndCount({
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

  async getProductsByCategory(categoryName: string, page: string, limit: string ): Promise<[Product[], number]> {
    try {
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);
  
      if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber <= 0 || limitNumber <= 0) {
        throw new Error('La pagina y el limite deben ser numeros positivos');
      }
  
      const category = await this.categoryRepository.findOne({
        where: { name: categoryName },
        relations: ['products']
      });
  
      if (!category) {
        throw new Error(`Categoria con nombre ${categoryName} no existe`);
      }
  
      const total = category.products.length;
  
      const paginatedProducts = category.products.slice((pageNumber - 1) * limitNumber, pageNumber * limitNumber);
  
      return [paginatedProducts, total];
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async searchProducts( keyword: string, page: string, limit: string): Promise<[Product[], number]> {
    try {
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);
  
      if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber <= 0 || limitNumber <= 0) {
        throw new Error('La página y el límite deben ser números positivos');
      }
  
      const keywords = this.extractKeywords(keyword);
  
      if (keywords.length === 0) {
        return [[], 0];
      }
  
      const queryBuilder = this.productRepository.createQueryBuilder("product");
  
      keywords.forEach((word, index) => {
        if (index === 0) {
          queryBuilder.where("product.name ILIKE :word", { word: `%${word}%` });
        } else {
          queryBuilder.orWhere("product.name ILIKE :word", { word: `%${word}%` });
        }
      });
  
      const [products, total] = await queryBuilder
        .skip((pageNumber - 1) * limitNumber)
        .take(limitNumber)
        .getManyAndCount();
  
      return [products, total];
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  extractKeywords(keyword: string): string[] {
    const commonArticles = ["el", "la", "los", "las", "un", "una", "unos", "unas", "de", "del", "al", "y", "o", "a", "en"];
    return keyword
      .toLowerCase()
      .split(" ")
      .filter(word => !commonArticles.includes(word));
  }

  // CRUD CATEGORIES
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

  getAllCategories(): Promise<Category[]> {
    throw new Error('Method not implemented.');
  }

  updateCategory(categoryName: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    throw new Error('Method not implemented.');
  }

  getCategoryByName(categoryName: string): Promise<Category> {
    throw new Error('Method not implemented.');
  }

  deleteCategory(categoryName: string): Promise<Category> {
    throw new Error('Method not implemented.');
  }

  //CRUD GROUP

  createGroup(createGroupDto: CreateGroupDto): Promise<import("./entities/group.entity").Group> {
    throw new Error('Method not implemented.');
  }

  getAllGroups(): Promise<Category[]> {
    throw new Error('Method not implemented.');
  }

  getGroupByName(groupName: string): Promise<Category> {
    throw new Error('Method not implemented.');
  }

  updateGroup(groupName: string, updateGroupDto: UpdateGroupDto): Promise<Category> {
    throw new Error('Method not implemented.');
  }

  deleteGroup(groupName: string): Promise<Category> {
    throw new Error('Method not implemented.');
  }

  //CRUD STOCK
  async createStock(stock:number): Promise<Stock>{
    const newStock = this.stockRepository.create({
      stock
    });

    return this.stockRepository.save(newStock);
  }


}
