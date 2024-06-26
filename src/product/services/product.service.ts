import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { DeleteResult, In, Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { Review } from '../entities/review.entity';
import { Stock } from '../entities/stock.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { Group } from '../entities/group.entity';
import { CreateReviewDto } from '../dto/create-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';
import { ConfigService } from '@nestjs/config';
import { PutObjectAclCommand, PutObjectCommand, S3Client} from '@aws-sdk/client-s3'

@Injectable()
export class ProductService {

  private readonly s3Client = new S3Client(
    {region: this.configService.getOrThrow('AWS_S3_REGION') }
  );

  constructor(
    private readonly configService: ConfigService,
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
  ) {}

  async createProduct(createProductDto: CreateProductDto, product_images: Array<Express.Multer.File>): Promise<Product> {
    
    createProductDto.image_urls = [];
    
    try{

      await Promise.all(product_images.map(async (product_image) => {
        await this.s3Client.send(
          new PutObjectCommand({
            Bucket: 'fitnest-bucket',
            Key: product_image.originalname,
            Body: product_image.buffer,
          })
        );

        const image_url = `https://fitnest-bucket.s3.amazonaws.com/${product_image.originalname}`;
        createProductDto.image_urls.push(image_url);
      }));

      const category: Category = await this.categoryRepository.findOne({where:{name: createProductDto.category}});

      if (!category) {
        throw new Error('La categoria seleccionada no existe');
      }

      const stock = await this.createStock(createProductDto.stock);

      const newProduct = this.productRepository.create({
        ...createProductDto,
        category: category,
        stock,
      });

      return await this.productRepository.save(newProduct);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getActiveProducts(
    page: string,
    limit: string,
  ): Promise<[Product[], number]> {
    try {
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      if (
        isNaN(pageNumber) ||
        isNaN(limitNumber) ||
        pageNumber <= 0 ||
        limitNumber <= 0
      ) {
        throw new Error('La pagina y el limite deben ser numeros positivos');
      }

      return await this.productRepository.findAndCount({
        where: { status: 'Activo' },
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber,
        relations: {
          category: true,
          stock: true,
          reviews: true,
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAllProducts(
    page: string,
    limit: string,
  ): Promise<[Product[], number]> {
    try {
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      if (
        isNaN(pageNumber) ||
        isNaN(limitNumber) ||
        pageNumber <= 0 ||
        limitNumber <= 0
      ) {
        throw new Error('La pagina y el limite deben ser numeros positivos');
      }

      return await this.productRepository.findAndCount({
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber,
        relations: {
          category: true,
          
          reviews: true,
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getProductById(id: string): Promise<Product> {
    try {
      const product = await this.productRepository.findOne({
        where: { id },
        relations: {
          category: true,
          stock: true,
          reviews: true,
        },
      });
      if (!product) {
        throw new Error(`El producto con ID: ${id} no existe`);
      }
      return product;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async getProductsByIds(ids: string[]): Promise<Product[]> {
    try {
      const products = await this.productRepository.find({
        where: {
          id: In(ids),
        },
        relations: {
          category: true,
          stock: true,
          reviews: true,
        },
      });

      if (products.length === 0) {
        throw new Error(
          `No se encontraron productos con los IDs proporcionados`,
        );
      }

      return products;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto, product_images: Array<Express.Multer.File>): Promise<Product> {
    
    updateProductDto.image_urls = []

    try {

      await Promise.all(product_images.map(async (product_image) => {
        await this.s3Client.send(
          new PutObjectCommand({
            Bucket: 'fitnest-bucket',
            Key: product_image.originalname,
            Body: product_image.buffer,
          })
        );

        const image_url = `https://fitnest-bucket.s3.amazonaws.com/${product_image.originalname}`;
        updateProductDto.image_urls.push(image_url);
      }));

      const product = await this.getProductById(id);

      if (!product) {
        throw new Error(
          `No es posible actualizar el producto con ID: ${id}, ya que no existe`,
        );
      }

      const stock = await this.updateStock(
        product.stock,
        updateProductDto.stock,
      );

      const updateProduct = Object.assign(product, {
        ...updateProductDto,
        stock,
      });
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

  // FILTERS

  async getProductsByCategory(
    categoryId: string,
    page: string,
    limit: string,
  ): Promise<[Product[], number]> {
    try {
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      if (
        isNaN(pageNumber) ||
        isNaN(limitNumber) ||
        pageNumber <= 0 ||
        limitNumber <= 0
      ) {
        throw new Error('La pagina y el limite deben ser numeros positivos');
      }

      const category = await this.getCategoryById(categoryId);

      const total = category.products.length;

      const paginatedProducts = category.products.slice(
        (pageNumber - 1) * limitNumber,
        pageNumber * limitNumber,
      );

      return [paginatedProducts, total];
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async searchProducts(
    keyword: string,
    page: string,
    limit: string,
  ): Promise<[Product[], number]> {
    try {
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      if (
        isNaN(pageNumber) ||
        isNaN(limitNumber) ||
        pageNumber <= 0 ||
        limitNumber <= 0
      ) {
        throw new Error('La página y el límite deben ser números positivos');
      }

      const keywords = this.extractKeywords(keyword);

      if (keywords.length === 0) {
        return [[], 0];
      }

      const queryBuilder = this.productRepository.createQueryBuilder('product');

      keywords.forEach((word, index) => {
        if (index === 0) {
          queryBuilder.where('product.name ILIKE :word', { word: `%${word}%` });
        } else {
          queryBuilder.orWhere('product.name ILIKE :word', {
            word: `%${word}%`,
          });
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
    const commonArticles = [
      'el',
      'la',
      'los',
      'las',
      'un',
      'una',
      'unos',
      'unas',
      'de',
      'del',
      'al',
      'y',
      'o',
      'a',
      'en',
    ];
    return keyword
      .toLowerCase()
      .split(' ')
      .filter((word) => !commonArticles.includes(word));
  }

  async getProductsByGroup(
    groupId: string,
    page: string,
    limit: string,
  ): Promise<[Product[], number]> {
    try {
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      if (
        isNaN(pageNumber) ||
        isNaN(limitNumber) ||
        pageNumber <= 0 ||
        limitNumber <= 0
      ) {
        throw new Error('La pagina y el limite deben ser numeros positivos');
      }
      const group: Group = await this.getGroupById(groupId);
      const categories = group.categories;
      const products = [];

      for (const category of categories) {
        const categoryProducts = await this.getCategoryById(category.id);
        products.push(...categoryProducts.products);
      }

      const total = products.length;

      const paginatedProducts = products.slice(
        (pageNumber - 1) * limitNumber,
        pageNumber * limitNumber,
      );

      return [paginatedProducts, total];
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getProductsSortedByPrice(order: 'ASC' | 'DESC', page: string, limit: string): Promise<[Product[], number]> {
    try {

      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      if (
        isNaN(pageNumber) ||
        isNaN(limitNumber) ||
        pageNumber <= 0 ||
        limitNumber <= 0
      ) {
        throw new Error('La pagina y el limite deben ser numeros positivos');
      }

      return await this.productRepository.findAndCount({
        relations: ['reviews', 'stock'],
        order:{price:order},
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber,
      })
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getProductsSortedByRating(order: 'ASC' | 'DESC', page: string, limit: string): Promise<[Product[], number]> {
    try {

      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      if (
        isNaN(pageNumber) ||
        isNaN(limitNumber) ||
        pageNumber <= 0 ||
        limitNumber <= 0
      ) {
        throw new Error('La pagina y el limite deben ser numeros positivos');
      }
      
      return await this.productRepository.findAndCount({
        relations: ['reviews', 'stock'],
        order:{rating:order},
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber,
      })
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getProductsSortedBySoldUnits(order: 'ASC' | 'DESC', page: string, limit: string): Promise<[Product[], number]> {
    try {

      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      if (
        isNaN(pageNumber) ||
        isNaN(limitNumber) ||
        pageNumber <= 0 ||
        limitNumber <= 0
      ) {
        throw new Error('La pagina y el limite deben ser numeros positivos');
      }

      return await this.productRepository.createQueryBuilder("product")
      .leftJoinAndSelect("product.stock", "stock")
      .leftJoinAndSelect("product.reviews", "reviews")
      .orderBy("stock.unities_sold", order)
      .skip((pageNumber - 1) * limitNumber)
      .take(limitNumber)
      .getManyAndCount();

    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getProductsSortedByPriceForCategory(categoryId: string, order: 'ASC' | 'DESC', page: string, limit: string): Promise<[Product[], number]> {
    try {
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);
  
      if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber <= 0 || limitNumber <= 0) {
        throw new Error('La página y el límite deben ser números positivos');
      }
  
      const category = await this.getCategoryById(categoryId);
  
      const [products, total] = await this.productRepository.createQueryBuilder("product")
        .leftJoinAndSelect("product.reviews", "reviews")
        .leftJoinAndSelect("product.stock", "stock")
        .where("product.categoryId = :categoryId", { categoryId: category.id })
        .orderBy("product.price", order)
        .skip((pageNumber - 1) * limitNumber)
        .take(limitNumber)
        .getManyAndCount();
  
      return [products, total];
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  

  async getProductsSortedByRatingForCategory(categoryId: string, order: 'ASC' | 'DESC', page: string, limit: string): Promise<[Product[], number]> {
    try {
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);
  
      if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber <= 0 || limitNumber <= 0) {
        throw new Error('La página y el límite deben ser números positivos');
      }
  
      const category = await this.getCategoryById(categoryId);
  
      const [products, total] = await this.productRepository.createQueryBuilder("product")
        .leftJoinAndSelect("product.reviews", "reviews")
        .leftJoinAndSelect("product.stock", "stock")
        .where("product.categoryId = :categoryId", { categoryId: category.id })
        .orderBy("product.rating", order)
        .skip((pageNumber - 1) * limitNumber)
        .take(limitNumber)
        .getManyAndCount();
  
      return [products, total];
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  

  async getProductsSortedBySoldUnitsForCategory(categoryId: string, order: 'ASC' | 'DESC', page: string, limit: string): Promise<[Product[], number]> {
    try {
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);

        if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber <= 0 || limitNumber <= 0) {
            throw new Error('La página y el límite deben ser números positivos');
        }

        const category = await this.getCategoryById(categoryId);

        const [products, total] = await this.productRepository.createQueryBuilder("product")
            .leftJoinAndSelect("product.stock", "stock")
            .leftJoinAndSelect("product.reviews", "reviews")
            .where("product.categoryId = :categoryId", { categoryId: category.id })
            .orderBy("stock.unities_sold", order)
            .skip((pageNumber - 1) * limitNumber)
            .take(limitNumber)
            .getManyAndCount();

        return [products, total];
    } catch (error) {
        throw new BadRequestException(error.message);
    }
}


  //FILTER GROUP

  async getProductsSortedByPriceForGroup(groupId: string, order: 'ASC' | 'DESC', page: string, limit: string): Promise<[Product[], number]> {
    try {
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);

        if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber <= 0 || limitNumber <= 0) {
            throw new Error('La página y el límite deben ser números positivos');
        }

        const group = await this.getGroupById(groupId);
        const groupUuid = group.id; 

        const [products, total] = await this.productRepository.createQueryBuilder("product")
            .leftJoin("product.category", "category")
            .leftJoinAndSelect("product.reviews", "reviews")
            .leftJoinAndSelect("product.stock", "stock")
            .where("category.groupId = :groupUuid", { groupUuid }) 
            .orderBy("product.price", order)
            .skip((pageNumber - 1) * limitNumber)
            .take(limitNumber)
            .getManyAndCount();

        return [products, total];
    } catch (error) {
        throw new BadRequestException(error.message);
    }
}

async getProductsSortedByRatingForGroup(groupId: string, order: 'ASC' | 'DESC', page: string, limit: string): Promise<[Product[], number]> {
  try {
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber <= 0 || limitNumber <= 0) {
          throw new Error('La página y el límite deben ser números positivos');
      }

      const group = await this.getGroupById(groupId);
      const groupUuid = group.id;  // Extraer solo el ID del grupo

      const [products, total] = await this.productRepository.createQueryBuilder("product")
          .leftJoin("product.category", "category")
          .leftJoinAndSelect("product.reviews", "reviews")
          .leftJoinAndSelect("product.stock", "stock")
          .where("category.groupId = :groupUuid", { groupUuid })  
          .orderBy("product.rating", order)
          .skip((pageNumber - 1) * limitNumber)
          .take(limitNumber)
          .getManyAndCount();

      return [products, total];
  } catch (error) {
      throw new BadRequestException(error.message);
  }
}


  async getProductsSortedBySoldUnitsForGroup(groupId: string, order: 'ASC' | 'DESC', page: string, limit: string): Promise<[Product[], number]> {
    try {
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);

        if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber <= 0 || limitNumber <= 0) {
            throw new Error('La pagina y el limite deben ser numeros positivos');
        }

        const group = await this.getGroupById(groupId);
        const groupUuid = group.id; // Extraer solo el ID del grupo

        const [products, total] = await this.productRepository.createQueryBuilder("product")
            .leftJoin("product.category", "category")
            .where("category.groupId = :groupUuid", { groupUuid }) 
            .leftJoinAndSelect("product.reviews", "reviews")
            .leftJoinAndSelect("product.stock", "stock")
            .orderBy("stock.unities_sold", order)
            .skip((pageNumber - 1) * limitNumber)
            .take(limitNumber)
            .getManyAndCount();

        return [products, total];
    } catch (error) {
        throw new BadRequestException(error.message);
    }
}

  // CRUD CATEGORIES
  async createCategory(createCategoryDto:CreateCategoryDto, category_image: Express.Multer.File): Promise<Category>{
    try {

      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: 'fitnest-bucket',
          Key: category_image.originalname,
          Body: category_image.buffer,
        })
      );
  
      const image_url = `https://fitnest-bucket.s3.amazonaws.com/${category_image.originalname}`;
      createCategoryDto.image_url = image_url;

      const categoryName = createCategoryDto.name;
      const category = await this.categoryRepository.findOne({
        where: { name: categoryName },
      });
      if (category) {
        throw Error(`La categoria con nombre: ${categoryName} ya existe`);
      }

      const group = await this.getGroupById(createCategoryDto.groupId);

      const newCategory = this.categoryRepository.create({
        ...createCategoryDto,
        group: group,
      });

      return await this.categoryRepository.save(newCategory);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAllCategories(
    page: string,
    limit: string,
  ): Promise<[Category[], number]> {
    try {
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      if (
        isNaN(pageNumber) ||
        isNaN(limitNumber) ||
        pageNumber <= 0 ||
        limitNumber <= 0
      ) {
        throw new Error('La pagina y el limite deben ser numeros positivos');
      }

      return await this.categoryRepository.findAndCount({
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber,
        relations: {
          products: true,
          group: true,
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto, category_image: Express.Multer.File): Promise<Category> {
    try {
      if(category_image){
        await this.s3Client.send(
          new PutObjectCommand({
            Bucket: 'fitnest-bucket',
            Key: category_image.originalname,
            Body: category_image.buffer,
          })
        );
    
        const image_url = `https://fitnest-bucket.s3.amazonaws.com/${category_image.originalname}`;
        updateCategoryDto.image_url = image_url;
      }

      const category = await this.getCategoryById(id);

      if (!category) {
        throw new Error(
          `No es posible actualizar la categoria con id ${id}, ya que no existe`,
        );
      }

      let group;
      const groupId = updateCategoryDto.groupId;
      if (groupId) {
        group = this.getGroupById(groupId);
      } else {
        group = category.group;
      }

      const updateCategory = Object.assign(category, {
        ...updateCategoryDto,
        group: group,
      });
      return await this.categoryRepository.save(updateCategory);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async getCategoryById(categoryId: string): Promise<Category> {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id: categoryId },
        relations: {
          products: {
            reviews: true,
          },
          group: true,
        },
      });
      if (!category) {
        throw new Error(`La categoria con id: ${categoryId} no existe`);
      }
      return category;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async deleteCategory(id: string): Promise<DeleteResult> {
    try {
      const category = this.getCategoryById(id);
      const result = await this.categoryRepository.delete(id);
      return result;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  //CRUD GROUP

  async createGroup(createGroupDto: CreateGroupDto, group_image: Express.Multer.File): Promise<Group> {
    
    try {

      if(group_image){
        await this.s3Client.send(
          new PutObjectCommand({
            Bucket: 'fitnest-bucket',
            Key: group_image.originalname,
            Body: group_image.buffer,
          })
        );
    
        const image_url = `https://fitnest-bucket.s3.amazonaws.com/${group_image.originalname}`;
        createGroupDto.image_url = image_url;
      }

      const groupName = createGroupDto.name;
      const group = await this.groupRepository.findOne({
        where: { name: groupName },
      });
      if (group) {
        throw Error(`El grupo con nombre: ${groupName} ya existe`);
      }
      const newGroup = this.groupRepository.create(createGroupDto);
      return await this.groupRepository.save(newGroup);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAllGroups(page: string, limit: string): Promise<[Group[], number]> {
    try {
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      if (
        isNaN(pageNumber) ||
        isNaN(limitNumber) ||
        pageNumber <= 0 ||
        limitNumber <= 0
      ) {
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

  async getGroupById(groupId: string): Promise<Group> {
    try {
      const group = await this.groupRepository.findOne({
        where: { id: groupId },
        relations: {
          categories: true,
        },
      });
      if (!group) {
        throw new Error(`El grupo con el id: ${groupId} no existe`);
      }
      return group;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async updateGroup(groupId: string, updateGroupDto: UpdateGroupDto, group_image: Express.Multer.File): Promise<Group> {

    if(group_image){
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: 'fitnest-bucket',
          Key: group_image.originalname,
          Body: group_image.buffer,
        })
      );
  
      const image_url = `https://fitnest-bucket.s3.amazonaws.com/${group_image.originalname}`;
      updateGroupDto.image_url = image_url;
    }

    try {
      const group = await this.getGroupById(groupId);

      if (!group) {
        throw new Error(
          `No es posible actualizar el grupo con id ${groupId}, ya que no existe`,
        );
      }

      const updateGroup = Object.assign(group, updateGroupDto);
      return await this.groupRepository.save(updateGroup);
    } catch (error) {
      throw new NotFoundException(error.message);
    }

  }

  async deleteGroup(groupId: string): Promise<DeleteResult> {
    try {
      const group = this.getGroupById(groupId);
      const result = await this.groupRepository.delete(groupId);
      return result;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  //CRUD STOCK
  async createStock(stock: number): Promise<Stock> {
    const newStock = this.stockRepository.create({
      stock,
    });

    return await this.stockRepository.save(newStock);
  }

  async updateStock(stock: Stock, value: number): Promise<Stock> {
    const updateStock = Object.assign(stock, {
      stock: value,
    });
    return await this.stockRepository.save(updateStock);
  }

  async updateSoldUnits(productId: string): Promise<Stock> {
    const product = await this.getProductById(productId);
    const stock = product.stock;
    const soldUnits = stock.unities_sold + 1;
    const updateStock = Object.assign(stock, {
      unities_sold: soldUnits,
    });
    return await this.stockRepository.save(updateStock);
  }

  //CRUD REVIEW

  async createReview(createReviewDto: CreateReviewDto): Promise<Review> {
    try {

      const product: Product = await this.getProductById(createReviewDto.productId);
      const newReview = this.reviewRepository.create({
        ...createReviewDto,
        product,
      });

      product.rating = this.calculateRating(product.reviews);

      await this.productRepository.save(product);

      return await this.reviewRepository.save(newReview);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAllReviews(
    page: string,
    limit: string,
  ): Promise<[Review[], number]> {
    try {
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      if (
        isNaN(pageNumber) ||
        isNaN(limitNumber) ||
        pageNumber <= 0 ||
        limitNumber <= 0
      ) {
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
        where: { id },
        relations: {
          user: true,
          product: true,
        },
      });
      if (!review) {
        throw new Error(`El comentario con id ${id} no existe`);
      }
      return review;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async getReviewsByProductId(
    productId: string,
    page: string,
    limit: string,
  ): Promise<[Review[], number]> {
    try {
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      if (
        isNaN(pageNumber) ||
        isNaN(limitNumber) ||
        pageNumber <= 0 ||
        limitNumber <= 0
      ) {
        throw new Error('La pagina y el limite deben ser numeros positivos');
      }

      const product = await this.productRepository.findOne({
        where: { id: productId },
        relations: {
          reviews: {
            user: true,
          },
        },
      });

      const total = product.reviews.length;

      const paginatedReviews = product.reviews.slice(
        (pageNumber - 1) * limitNumber,
        pageNumber * limitNumber,
      );

      return [paginatedReviews, total];
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateReview(
    id: string,
    updateReviewDto: UpdateReviewDto,
  ): Promise<Review> {
    try {
      const review = await this.getReviewById(id);

      if (!review) {
        throw new Error(
          `No es posible actualizar el comentario con id ${id}, ya que no existe`,
        );
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

  calculateRating(review: Review[]): number {
    const total = review.reduce((acc, review) => acc + review.score, 0);
    return total / review.length;
  }
}
