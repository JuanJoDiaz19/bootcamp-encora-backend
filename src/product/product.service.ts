import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { DeleteResult, Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { Review } from './entities/review.entity';
import { Stock } from './entities/stock.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './entities/group.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

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
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
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
        
      return await this.productRepository.save(newProduct);
    }catch(error){
      throw new BadRequestException(error.message);
    }

  }

  async getActiveProducts(page: string, limit: string):Promise<[Product[], number]>{

    try {
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber <= 0 || limitNumber <= 0) {
        throw new Error('La pagina y el limite deben ser numeros positivos');
      }

      return await this.productRepository.findAndCount({
        where:{status:'Activo'},
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
      const product = await this.productRepository.findOne({
        where:{id},
        relations:{
          category:true,
          stock:true,
        }
      });
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
        throw new Error(`No es posible actualizar el producto con ID: ${id}, ya que no existe`);
      }

      const stock = await this.updateStock(product.stock,updateProductDto.stock);
  
      const updateProduct = Object.assign(product,{
        ...updateProductDto,
        stock,
      } );
      return await this.productRepository.save(updateProduct);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async removeProduct(id: string): Promise<DeleteResult> {
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

      const group = await this.getGroupByName(createCategoryDto.groupName);

      const newCategory = this.categoryRepository.create({
        ...createCategoryDto,
        group:group,
      });

      return await this.categoryRepository.save(newCategory);
    } catch (error) {
      throw new BadRequestException(error.message);
    } 
  }

  async getAllCategories(page: string, limit: string): Promise<[Category[],number]> {
    try {
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber <= 0 || limitNumber <= 0) {
        throw new Error('La pagina y el limite deben ser numeros positivos');
      }

      return await this.categoryRepository.findAndCount({
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber,
        relations: {
          products: true,
          group:true,
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateCategory(categoryName: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    try {
      const category = await this.getCategoryByName(categoryName);

      if(!category){
        throw new Error(`No es posible actualizar la categoria con nombre ${categoryName}, ya que no existe`);
      }
  
      const updateCategory = Object.assign(category, updateCategoryDto);
      return await this.categoryRepository.save(updateCategory);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async getCategoryByName(categoryName: string): Promise<Category> {
    try {
      const category = await this.categoryRepository.findOne({
        where:{name:categoryName},
        relations:{
          products:true,
          group:true,
        }
      });
      if(!category){
        throw new Error(`La categoria con nombre: ${categoryName} no existe`);
      }
      return category;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async deleteCategory(categoryName: string): Promise<DeleteResult> {
    try {
      const category = this.getCategoryByName(categoryName);
      const result = await this.categoryRepository.delete(categoryName);
      return result;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  //CRUD GROUP

  async createGroup(createGroupDto: CreateGroupDto): Promise<Group> {
    try {
      const groupName = createGroupDto.name;
      const group = await this.groupRepository.findOne({where:{name:groupName}})
      if(group){
        throw Error(`El grupo con nombre: ${groupName} ya existe`);
      }
      const newGroup = this.groupRepository.create(createGroupDto);
      return await this.groupRepository.save(newGroup);
    } catch (error) {
      throw new BadRequestException(error.message);
    } 
  }

  async getAllGroups(page: string, limit: string): Promise<[Group[],number]> {
    try {
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber <= 0 || limitNumber <= 0) {
        throw new Error('La pagina y el limite deben ser numeros positivos');
      }

      return await this.groupRepository.findAndCount({
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber,
        relations: {
          categories: true,
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getGroupByName(groupName: string): Promise<Group> {
    try {
      const group = await this.groupRepository.findOne({
        where:{name:groupName},
        relations:{
          categories:true,
        }
      });
      if(!group){
        throw new Error(`El grupo con nombre: ${groupName} no existe`);
      }
      return group;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async updateGroup(groupName: string, updateGroupDto: UpdateGroupDto): Promise<Group> {
    try {
      const group = await this.getGroupByName(groupName);

      if(!group){
        throw new Error(`No es posible actualizar el grupo con nombre ${groupName}, ya que no existe`);
      }
  
      const updateGroup = Object.assign(group, updateGroupDto);
      return await this.groupRepository.save(updateGroup);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async deleteGroup(groupName: string): Promise<DeleteResult> {
    try {
      const group = this.getGroupByName(groupName);
      const result = await this.groupRepository.delete(groupName);
      return result;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  //CRUD STOCK
  async createStock(stock:number): Promise<Stock>{
    const newStock = this.stockRepository.create({
      stock
    });

    return await this.stockRepository.save(newStock);
  }

  async updateStock(stock: Stock, value: number):Promise<Stock>{
    const updateStock = Object.assign(stock,{
      stock:value,
    } );
    return await this.stockRepository.save(updateStock);
  }

  async updateSoldUnits(productId:string ): Promise<Stock>{
    const product = await this.getProductById(productId);
    const stock = product.stock
    const soldUnits = stock.unities_sold+1
    const updateStock = Object.assign(stock,{
      unities_sold:soldUnits,
    } );
    return await this.stockRepository.save(updateStock);
  }

  //CRUD REVIEW

  async createReview(createReviewDto: CreateReviewDto): Promise<Review> {
    try {
      const product = await this.getProductById(createReviewDto.productId);
      const newStock = this.reviewRepository.create({
        ...createReviewDto,
        product,
      });
      return await this.reviewRepository.save(newStock);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAllReviews(page: string, limit: string): Promise<[Review[], number]> {
    try {
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber <= 0 || limitNumber <= 0) {
        throw new Error('La pagina y el limite deben ser numeros positivos');
      }

      return await this.reviewRepository.findAndCount({
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber,
        relations: {
          product: true,
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getReviewById(id: string): Promise<Review> {
    try {
      const review = await this.reviewRepository.findOne({
        where:{id},
        relations:{
          product:true,
        }
      });
      if(!review){
        throw new Error(`El comentario con id ${id} no existe`);
      }
      return review;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async updateReview(id: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
    try {
      const review = await this.getReviewById(id);

      if(!review){
        throw new Error(`No es posible actualizar el comentario con id ${id}, ya que no existe`);
      }
  
      const updateReview = Object.assign(review, updateReviewDto);
      return await this.reviewRepository.save(updateReview);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async deleteReview(id: string): Promise<DeleteResult> {
    try {
      const review = this.getReviewById(id);
      const result = await this.reviewRepository.delete(id);
      return result;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

}
