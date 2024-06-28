import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { Review } from '../entities/review.entity';
import { Stock } from '../entities/stock.entity';
import { Group } from '../entities/group.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { UserService } from '../../auth/services/user.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { CreateReviewDto } from '../dto/create-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';

jest.mock('@aws-sdk/client-s3');

describe('ProductService', () => {
  let service: ProductService;
  let userService: typeof mockUserService;
  
  let productRepository: MockType<Repository<Product>>;
  let categoryRepository: MockType<Repository<Category>>;
  let reviewRepository: MockType<Repository<Review>>;
  let stockRepository: MockType<Repository<Stock>>;
  let groupRepository: MockType<Repository<Group>>;
  let configService: MockType<ConfigService>;
  let s3Client: S3Client;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Category),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Review),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Stock),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Group),
          useValue: mockRepository(),
        },
        {
          provide: ConfigService,
          useValue: mockConfigService(),
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: S3Client,
          useClass: jest.fn(() => ({
            send: jest.fn(),
          })),
        },
      ],
    }).compile();
    service = module.get<ProductService>(ProductService);
    userService = module.get<UserService>(UserService) as any;

    productRepository = module.get(getRepositoryToken(Product));
    categoryRepository = module.get(getRepositoryToken(Category));
    reviewRepository = module.get(getRepositoryToken(Review));
    stockRepository = module.get(getRepositoryToken(Stock));
    groupRepository = module.get(getRepositoryToken(Group));
    configService = module.get(ConfigService);
    s3Client = module.get(S3Client);
  });

  const mockUserService = {
    findUserById: jest.fn(),
  };
  

  function mockRepository() {
    return {
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      findAndCount: jest.fn(),
      delete: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn(),
      }),
    };
  }

  function mockConfigService() {
    return {
      getOrThrow: jest.fn().mockReturnValue('us-west-2'),
    };
  }

  type MockType<T> = {
    [P in keyof T]: jest.Mock<{}>;
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(productRepository).toBeDefined();
    expect(categoryRepository).toBeDefined();
    expect(reviewRepository).toBeDefined();
    expect(stockRepository).toBeDefined();
    expect(groupRepository).toBeDefined();
    expect(userService).toBeDefined();
    expect(configService).toBeDefined();
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Product1',
        description: 'Description1',
        type: 'Type1',
        price: 100,
        stock: 10,
        category: 'Category1',
        image_urls: [],
      };
      const product_images: Array<Express.Multer.File> = [
        {
          originalname: 'image1.png',
          buffer: Buffer.from(''),
        } as Express.Multer.File,
      ];
      const category = { id: '1', name: 'Category1' } as Category;
      const stock = { id: '1', stock: 10 } as Stock;
      const newProduct = { id: '1', ...createProductDto, category, stock } as Product;

      categoryRepository.findOne = jest.fn().mockResolvedValue(category);
      stockRepository.create = jest.fn().mockReturnValue(stock);
      stockRepository.save = jest.fn().mockResolvedValue(stock);
      productRepository.create = jest.fn().mockReturnValue(newProduct);
      productRepository.save = jest.fn().mockResolvedValue(newProduct);
      (s3Client.send as jest.Mock).mockResolvedValue({});

      const result = await service.createProduct(createProductDto, product_images);

      expect(result).toEqual(newProduct);
      expect(categoryRepository.findOne).toHaveBeenCalledWith({ where: { name: createProductDto.category } });
      expect(stockRepository.create).toHaveBeenCalledWith({ stock: createProductDto.stock });
      expect(stockRepository.save).toHaveBeenCalledWith(stock);
      expect(productRepository.create).toHaveBeenCalledWith({ ...createProductDto, category, stock });
      expect(productRepository.save).toHaveBeenCalledWith(newProduct);
    });

    it('should throw BadRequestException on invalid data', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Product1',
        description: 'Description1',
        type: 'Type1',
        price: 100,
        stock: 10,
        category: 'InvalidCategory',
        image_urls: [],
      };
      const product_images: Array<Express.Multer.File> = [
        {
          originalname: 'image1.png',
          buffer: Buffer.from(''),
        } as Express.Multer.File,
      ];

      categoryRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.createProduct(createProductDto, product_images)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getProductById', () => {
    it('should return a product', async () => {
      const product = { id: '1', name: 'Product1' } as Product;

      productRepository.findOne = jest.fn().mockResolvedValue(product);

      const result = await service.getProductById('1');

      expect(result).toEqual(product);
      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: { category: true, stock: true, reviews: true },
      });
    });

    it('should throw NotFoundException when product is not found', async () => {
      productRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.getProductById('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeProduct', () => {
    it('should remove a product', async () => {
      const product = { id: '1', name: 'Product1', stock: { id: '1' } } as Product;
      const deleteResult = { affected: 1 } as DeleteResult;

      jest.spyOn(service, 'getProductById').mockResolvedValue(product);
      stockRepository.delete = jest.fn().mockResolvedValue(deleteResult);
      productRepository.delete = jest.fn().mockResolvedValue(deleteResult);

      const result = await service.removeProduct('1');

      expect(result).toEqual(deleteResult);
      expect(stockRepository.delete).toHaveBeenCalledWith({ product: { id: product.id } });
      expect(productRepository.delete).toHaveBeenCalledWith(product.id);
    });

    it('should throw NotFoundException when product is not found', async () => {
      jest.spyOn(service, 'getProductById').mockRejectedValue(new NotFoundException('Product not found'));

      await expect(service.removeProduct('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'UpdatedProduct',
        description: 'UpdatedDescription',
        type: 'UpdatedType',
        price: 200,
        stock: 20,
        category: 'Category1',
        existing_images: [],
        stockValue: 0,
      };
      const product_images: Array<Express.Multer.File> = [
        {
          originalname: 'image1.png',
          buffer: Buffer.from(''),
        } as Express.Multer.File,
      ];
      const product = { id: '1', name: 'Product1', stock: { id: '1' }, image_urls: ["https://fitnest-bucket.s3.amazonaws.com/image1.png"], } as Product;
      const updatedProduct = { ...product, ...updateProductDto };

      jest.spyOn(service, 'getProductById').mockResolvedValue(product);
      stockRepository.save = jest.fn().mockResolvedValue(product.stock);
      productRepository.save = jest.fn().mockResolvedValue(updatedProduct);

      const result = await service.updateProduct('1', updateProductDto, product_images);

      expect(result).toEqual(updatedProduct);
      expect(service.getProductById).toHaveBeenCalledWith('1');
      expect(stockRepository.save).toHaveBeenCalledWith({ ...product.stock, stock: updateProductDto.stock });
    });

    it('should throw NotFoundException when product is not found', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'UpdatedProduct',
        description: 'UpdatedDescription',
        type: 'UpdatedType',
        price: 200,
        category: 'Category1',
        image_urls: [],
        stockValue: 20,
        existing_images: []
      };
      const product_images: Array<Express.Multer.File> = [
        {
          originalname: 'image1.png',
          buffer: Buffer.from(''),
        } as Express.Multer.File,
      ];

      jest.spyOn(service, 'getProductById').mockRejectedValue(new NotFoundException('Product not found'));

      await expect(service.updateProduct('1', updateProductDto, product_images)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getActiveProducts', () => {
    it('should return active products', async () => {
      const product = { id: '1', name: 'Product1', status: 'Activo' } as Product;
      const products = [product];
      const total = 1;

      productRepository.findAndCount = jest.fn().mockResolvedValue([products, total]);

      const result = await service.getActiveProducts('1', '10');

      expect(result).toEqual([products, total]);
      expect(productRepository.findAndCount).toHaveBeenCalledWith({
        where: { status: 'Activo' },
        skip: 0,
        take: 10,
        relations: { category: true, stock: true, reviews: true },
      });
    });

    it('should throw BadRequestException on invalid page or limit', async () => {
      await expect(service.getActiveProducts('invalid', '10')).rejects.toThrow(BadRequestException);
      await expect(service.getActiveProducts('1', 'invalid')).rejects.toThrow(BadRequestException);
      await expect(service.getActiveProducts('-1', '10')).rejects.toThrow(BadRequestException);
      await expect(service.getActiveProducts('1', '-10')).rejects.toThrow(BadRequestException);
    });
  });

   // FILTERS
   describe('getProductsByCategory', () => {
    it('should return products by category', async () => {
      const categoryName = 'Category1';
      const category = { id: '1', name: categoryName, products: [{ id: '1', name: 'Product1' }] } as Category;
      const paginatedProducts = category.products;
      const total = category.products.length;

      jest.spyOn(service, 'getCategoryByName').mockResolvedValue(category);

      const result = await service.getProductsByCategory(categoryName, '1', '10');

      expect(result).toEqual([paginatedProducts, total]);
      expect(service.getCategoryByName).toHaveBeenCalledWith(categoryName);
    });

    it('should throw BadRequestException on invalid page or limit', async () => {
      await expect(service.getProductsByCategory('Category1', 'invalid', '10')).rejects.toThrow(BadRequestException);
      await expect(service.getProductsByCategory('Category1', '1', 'invalid')).rejects.toThrow(BadRequestException);
      await expect(service.getProductsByCategory('Category1', '-1', '10')).rejects.toThrow(BadRequestException);
      await expect(service.getProductsByCategory('Category1', '1', '-10')).rejects.toThrow(BadRequestException);
    });
  });

  describe('searchProducts', () => {
    it('should return searched products', async () => {
      const keyword = 'Product';
      const page = '1';
      const limit = '10';
      const products = [{ id: '1', name: 'Product1' }];
      const total = products.length;

      jest.spyOn(productRepository, 'createQueryBuilder').mockReturnValue({
        where: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([products, total]),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
    });

      const result = await service.searchProducts(keyword, page, limit);

      expect(result).toEqual([products, total]);
      expect(productRepository.createQueryBuilder).toHaveBeenCalled();
    });

    it('should throw BadRequestException on invalid page or limit', async () => {
      await expect(service.searchProducts('Product', 'invalid', '10')).rejects.toThrow(BadRequestException);
      await expect(service.searchProducts('Product', '1', 'invalid')).rejects.toThrow(BadRequestException);
      await expect(service.searchProducts('Product', '-1', '10')).rejects.toThrow(BadRequestException);
      await expect(service.searchProducts('Product', '1', '-10')).rejects.toThrow(BadRequestException);
    });
  });

  describe('getProductsByGroup', () => {
    it('should return products by group', async () => {
      const groupName = 'Group1';
      const category : Category = {
        id: '1', products: [{
          id: '1', name: 'Product1',
          type: '',
          creation_date: undefined,
          description: '',
          price: 0,
          rating: 0,
          image_urls: [],
          category: new Category,
          status: '',
          stock: new Stock,
          reviews: [],
          order_items: [],
          shopping_cart_items: []
        }],
        name: '',
        description: '',
        group: new Group,
        image_url: ''
      };
      const group = { id: '1', name: groupName, categories: [category] } as Group;
      const products = group.categories[0].products;
      const total = products.length;

      jest.spyOn(service,'getCategoryById').mockResolvedValue(category)

      jest.spyOn(service, 'getGroupByName').mockResolvedValue(group);

      const result = await service.getProductsByGroup(groupName, '1', '10');

      expect(result).toEqual([products, total]);
      expect(service.getGroupByName).toHaveBeenCalledWith(groupName);
    });

    it('should throw BadRequestException on invalid page or limit', async () => {
      await expect(service.getProductsByGroup('Group1', 'invalid', '10')).rejects.toThrow(BadRequestException);
      await expect(service.getProductsByGroup('Group1', '1', 'invalid')).rejects.toThrow(BadRequestException);
      await expect(service.getProductsByGroup('Group1', '-1', '10')).rejects.toThrow(BadRequestException);
      await expect(service.getProductsByGroup('Group1', '1', '-10')).rejects.toThrow(BadRequestException);
    });
  });

  describe('getProductsSortedByPrice', () => {
    it('should return products sorted by price', async () => {
      const products = [{ id: '1', name: 'Product1', price: 100 }];
      const total = products.length;

      productRepository.findAndCount = jest.fn().mockResolvedValue([products, total]);

      const result = await service.getProductsSortedByPrice('ASC', '1', '10');

      expect(result).toEqual([products, total]);
      expect(productRepository.findAndCount).toHaveBeenCalledWith({
        relations: ['reviews', 'stock'],
        order: { price: 'ASC' },
        skip: 0,
        take: 10,
      });
    });

    it('should throw BadRequestException on invalid page or limit', async () => {
      await expect(service.getProductsSortedByPrice('ASC', 'invalid', '10')).rejects.toThrow(BadRequestException);
      await expect(service.getProductsSortedByPrice('ASC', '1', 'invalid')).rejects.toThrow(BadRequestException);
      await expect(service.getProductsSortedByPrice('ASC', '-1', '10')).rejects.toThrow(BadRequestException);
      await expect(service.getProductsSortedByPrice('ASC', '1', '-10')).rejects.toThrow(BadRequestException);
    });
  });

  describe('getProductsSortedByRating', () => {
    it('should return products sorted by rating', async () => {
      const products = [{ id: '1', name: 'Product1', rating: 5 }];
      const total = products.length;

      productRepository.findAndCount = jest.fn().mockResolvedValue([products, total]);

      const result = await service.getProductsSortedByRating('ASC', '1', '10');

      expect(result).toEqual([products, total]);
      expect(productRepository.findAndCount).toHaveBeenCalledWith({
        relations: ['reviews', 'stock'],
        order: { rating: 'ASC' },
        skip: 0,
        take: 10,
      });
    });

    it('should throw BadRequestException on invalid page or limit', async () => {
      await expect(service.getProductsSortedByRating('ASC', 'invalid', '10')).rejects.toThrow(BadRequestException);
      await expect(service.getProductsSortedByRating('ASC', '1', 'invalid')).rejects.toThrow(BadRequestException);
      await expect(service.getProductsSortedByRating('ASC', '-1', '10')).rejects.toThrow(BadRequestException);
      await expect(service.getProductsSortedByRating('ASC', '1', '-10')).rejects.toThrow(BadRequestException);
    });
  });

  describe('getProductsSortedBySoldUnits', () => {
    it('should return products sorted by sold units', async () => {
      const products = [{ id: '1', name: 'Product1', stock: { unities_sold: 10 } }];
      const total = products.length;

      jest.spyOn(productRepository, 'createQueryBuilder').mockReturnValue({
        getManyAndCount: jest.fn().mockResolvedValue([products, total]),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
    });
      const result = await service.getProductsSortedBySoldUnits('ASC', '1', '10');

      expect(result).toEqual([products, total]);
      expect(productRepository.createQueryBuilder).toHaveBeenCalled();
    });

    it('should throw BadRequestException on invalid page or limit', async () => {
      await expect(service.getProductsSortedBySoldUnits('ASC', 'invalid', '10')).rejects.toThrow(BadRequestException);
      await expect(service.getProductsSortedBySoldUnits('ASC', '1', 'invalid')).rejects.toThrow(BadRequestException);
      await expect(service.getProductsSortedBySoldUnits('ASC', '-1', '10')).rejects.toThrow(BadRequestException);
      await expect(service.getProductsSortedBySoldUnits('ASC', '1', '-10')).rejects.toThrow(BadRequestException);
    });
  });

  describe('getProductsSortedByPriceForCategory', () => {
    it('should return products sorted by price for category', async () => {
      const categoryId = '1';
      const products = [{ id: '1', name: 'Product1', price: 100 }];
      const total = products.length;
      jest.spyOn(service, 'getCategoryById').mockResolvedValue({ id: categoryId, products } as Category);

      jest.spyOn(productRepository, 'createQueryBuilder').mockReturnValue({
        getManyAndCount: jest.fn().mockResolvedValue([products, total]),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
      });

      const result = await service.getProductsSortedByPriceForCategory(categoryId, 'ASC', '1', '10');

      expect(result).toEqual([products, total]);
      expect(service.getCategoryById).toHaveBeenCalledWith(categoryId);
      expect(productRepository.createQueryBuilder).toHaveBeenCalled();
    });

    it('should throw BadRequestException on invalid page or limit', async () => {
      await expect(service.getProductsSortedByPriceForCategory('1', 'ASC', 'invalid', '10')).rejects.toThrow(BadRequestException);
      await expect(service.getProductsSortedByPriceForCategory('1', 'ASC', '1', 'invalid')).rejects.toThrow(BadRequestException);
      await expect(service.getProductsSortedByPriceForCategory('1', 'ASC', '-1', '10')).rejects.toThrow(BadRequestException);
      await expect(service.getProductsSortedByPriceForCategory('1', 'ASC', '1', '-10')).rejects.toThrow(BadRequestException);
    });
  });

  describe('getProductsSortedByRatingForCategory', () => {
    it('should return products sorted by rating for category', async () => {
      const categoryId = '1';
      const products = [{ id: '1', name: 'Product1', rating: 5 }];
      const total = products.length;

      jest.spyOn(service, 'getCategoryById').mockResolvedValue({ id: categoryId, products } as Category);

      jest.spyOn(productRepository, 'createQueryBuilder').mockReturnValue({
        getManyAndCount: jest.fn().mockResolvedValue([products, total]),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
      });

      const result = await service.getProductsSortedByRatingForCategory(categoryId, 'ASC', '1', '10');

      expect(result).toEqual([products, total]);
      expect(service.getCategoryById).toHaveBeenCalledWith(categoryId);
      expect(productRepository.createQueryBuilder).toHaveBeenCalled();
    });

    it('should throw BadRequestException on invalid page or limit', async () => {
      await expect(service.getProductsSortedByRatingForCategory('1', 'ASC', 'invalid', '10')).rejects.toThrow(BadRequestException);
      await expect(service.getProductsSortedByRatingForCategory('1', 'ASC', '1', 'invalid')).rejects.toThrow(BadRequestException);
      await expect(service.getProductsSortedByRatingForCategory('1', 'ASC', '-1', '10')).rejects.toThrow(BadRequestException);
      await expect(service.getProductsSortedByRatingForCategory('1', 'ASC', '1', '-10')).rejects.toThrow(BadRequestException);
    });
  });

  describe('getProductsSortedBySoldUnitsForCategory', () => {
    it('should return products sorted by sold units for category', async () => {
      const categoryId = '1';
      const products = [{ id: '1', name: 'Product1', stock: { unities_sold: 10 } }];
      const total = products.length;

      jest.spyOn(service, 'getCategoryById').mockResolvedValue({ id: categoryId, products } as Category);
      jest.spyOn(productRepository, 'createQueryBuilder').mockReturnValue({
        getManyAndCount: jest.fn().mockResolvedValue([products, total]),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
      });

      const result = await service.getProductsSortedBySoldUnitsForCategory(categoryId, 'ASC', '1', '10');

      expect(result).toEqual([products, total]);
      expect(service.getCategoryById).toHaveBeenCalledWith(categoryId);
      expect(productRepository.createQueryBuilder).toHaveBeenCalled();
    });

    it('should throw BadRequestException on invalid page or limit', async () => {
      await expect(service.getProductsSortedBySoldUnitsForCategory('1', 'ASC', 'invalid', '10')).rejects.toThrow(BadRequestException);
      await expect(service.getProductsSortedBySoldUnitsForCategory('1', 'ASC', '1', 'invalid')).rejects.toThrow(BadRequestException);
      await expect(service.getProductsSortedBySoldUnitsForCategory('1', 'ASC', '-1', '10')).rejects.toThrow(BadRequestException);
      await expect(service.getProductsSortedBySoldUnitsForCategory('1', 'ASC', '1', '-10')).rejects.toThrow(BadRequestException);
    });
  });

  // CRUD CATEGORIES
  describe('createCategory', () => {
    it('should create a new category', async () => {
      const createCategoryDto = { name: 'Category1', groupName: 'Group1', image_url: '' } as CreateCategoryDto;
      const category_image = { originalname: 'image1.png', buffer: Buffer.from('') } as Express.Multer.File;
      const group = { id: '1', name: 'Group1' } as Group;
      const newCategory = { id: '1', name: createCategoryDto.name, group } as Category;

      jest.spyOn(service, 'getGroupByName').mockResolvedValue(group);
      categoryRepository.create.mockReturnValue(newCategory);
      categoryRepository.save = jest.fn().mockResolvedValue(newCategory);
      s3Client.send = jest.fn().mockResolvedValue({});

      const result = await service.createCategory(createCategoryDto, category_image);

      expect(result).toEqual(newCategory);
      expect(service.getGroupByName).toHaveBeenCalledWith(createCategoryDto.groupName);
      expect(categoryRepository.create).toHaveBeenCalledWith({ ...createCategoryDto, image_url: `https://fitnest-bucket.s3.amazonaws.com/${category_image.originalname}`, group });
      expect(categoryRepository.save).toHaveBeenCalledWith(newCategory);
    });

    it('should throw BadRequestException on duplicate category', async () => {
      const createCategoryDto = { name: 'Category1', groupName: 'Group1', image_url: '' } as CreateCategoryDto;
      const category_image = { originalname: 'image1.png', buffer: Buffer.from('') } as Express.Multer.File;

      categoryRepository.findOne = jest.fn().mockResolvedValue({ id: '1', name: createCategoryDto.name });

      await expect(service.createCategory(createCategoryDto, category_image)).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateCategory', () => {
    it('should update a category', async () => {
      const updateCategoryDto = { name: 'UpdatedCategory', groupId: '1', existing_image: '' } as UpdateCategoryDto;
      const category_image = { originalname: 'image1.png', buffer: Buffer.from('') } as Express.Multer.File;
      const category = { id: '1', name: 'Category1', group: { id: '1', name: 'Group1' } } as Category;
      const updatedCategory = { id:'1', name: 'UpdatedCategory', groupId: '1', group: { id: '1', name: 'Group1' }, existing_image: '', image_url: "https://fitnest-bucket.s3.amazonaws.com/image1.png"};

      jest.spyOn(service, 'getCategoryById').mockResolvedValue(category);
      jest.spyOn(service, 'getGroupById').mockResolvedValue(category.group);
      categoryRepository.save = jest.fn().mockResolvedValue(updatedCategory);
      s3Client.send = jest.fn().mockResolvedValue({});

      const result = await service.updateCategory('1', updateCategoryDto, category_image);

      expect(result).toEqual(updatedCategory);
      expect(service.getCategoryById).toHaveBeenCalledWith('1');
      expect(service.getGroupById).toHaveBeenCalledWith(updateCategoryDto.groupId);
      expect(categoryRepository.save).toHaveBeenCalledWith(updatedCategory);
    });

    it('should throw NotFoundException when category is not found', async () => {
      const updateCategoryDto = { name: 'UpdatedCategory', groupId: '1', existing_image: '' } as UpdateCategoryDto;
      const category_image = { originalname: 'image1.png', buffer: Buffer.from('') } as Express.Multer.File;

      jest.spyOn(service, 'getCategoryById').mockRejectedValue(new NotFoundException('Category not found'));

      await expect(service.updateCategory('1', updateCategoryDto, category_image)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category', async () => {
      const category = { id: '1', name: 'Category1', products: [] } as Category;
      const deleteResult = { affected: 1 } as DeleteResult;

      jest.spyOn(service, 'getCategoryById').mockResolvedValue(category);
      categoryRepository.delete = jest.fn().mockResolvedValue(deleteResult);

      const result = await service.deleteCategory('1');

      expect(result).toEqual(deleteResult);
      expect(service.getCategoryById).toHaveBeenCalledWith('1');
      expect(categoryRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when category is not found', async () => {
      jest.spyOn(service, 'getCategoryById').mockRejectedValue(new NotFoundException('Category not found'));

      await expect(service.deleteCategory('1')).rejects.toThrow(NotFoundException);
    });
  });

  //CRUD GROUP
  describe('createGroup', () => {
    it('should create a new group', async () => {
      const createGroupDto = { name: 'Group1', image_url: '' } as CreateGroupDto;
      const group_image = { originalname: 'image1.png', buffer: Buffer.from('') } as Express.Multer.File;
      const newGroup = { id: '1', name: createGroupDto.name } as Group;

      groupRepository.create.mockReturnValue(newGroup);
      groupRepository.save = jest.fn().mockResolvedValue(newGroup);
      s3Client.send = jest.fn().mockResolvedValue({});

      const result = await service.createGroup(createGroupDto, group_image);

      expect(result).toEqual(newGroup);
      expect(groupRepository.create).toHaveBeenCalledWith({ ...createGroupDto, image_url: `https://fitnest-bucket.s3.amazonaws.com/${group_image.originalname}` });
      expect(groupRepository.save).toHaveBeenCalledWith(newGroup);
    });

    it('should throw BadRequestException on duplicate group', async () => {
      const createGroupDto = { name: 'Group1', image_url: '' } as CreateGroupDto;
      const group_image = { originalname: 'image1.png', buffer: Buffer.from('') } as Express.Multer.File;

      groupRepository.findOne = jest.fn().mockResolvedValue({ id: '1', name: createGroupDto.name });

      await expect(service.createGroup(createGroupDto, group_image)).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateGroup', () => {
    it('should update a group', async () => {
      const updateGroupDto = { name: 'UpdatedGroup', image_url: '' } as UpdateGroupDto;
      const group_image = { originalname: 'image1.png', buffer: Buffer.from('') } as Express.Multer.File;
      const group = { id: '1', name: 'Group1' } as Group;
      const updatedGroup = { ...group, ...updateGroupDto };

      jest.spyOn(service, 'getGroupById').mockResolvedValue(group);
      groupRepository.save = jest.fn().mockResolvedValue(updatedGroup);
      s3Client.send = jest.fn().mockResolvedValue({});

      const result = await service.updateGroup('1', updateGroupDto, group_image);

      expect(result).toEqual(updatedGroup);
      expect(service.getGroupById).toHaveBeenCalledWith('1');
      expect(groupRepository.save).toHaveBeenCalledWith({...updatedGroup,image_url:"https://fitnest-bucket.s3.amazonaws.com/image1.png"});
    });

    it('should throw NotFoundException when group is not found', async () => {
      const updateGroupDto = { name: 'UpdatedGroup', existing_image: '' } as UpdateGroupDto;
      const group_image = { originalname: 'image1.png', buffer: Buffer.from('') } as Express.Multer.File;

      jest.spyOn(service, 'getGroupById').mockRejectedValue(new NotFoundException('Group not found'));

      await expect(service.updateGroup('1', updateGroupDto, group_image)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteGroup', () => {
    it('should delete a group', async () => {
      const group = { id: '1', name: 'Group1', categories: [] } as Group;
      const deleteResult = { affected: 1 } as DeleteResult;

      jest.spyOn(service, 'getGroupById').mockResolvedValue(group);
      groupRepository.delete = jest.fn().mockResolvedValue(deleteResult);

      const result = await service.deleteGroup('1');

      expect(result).toEqual(deleteResult);
      expect(service.getGroupById).toHaveBeenCalledWith('1');
      expect(groupRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when group is not found', async () => {
      jest.spyOn(service, 'getGroupById').mockRejectedValue(new NotFoundException('Group not found'));

      await expect(service.deleteGroup('1')).rejects.toThrow(NotFoundException);
    });
  });

  // CRUD STOCK
  describe('createStock', () => {
    it('should create a new stock', async () => {
      const stockValue = 10;
      const newStock = { id: '1', stock: stockValue } as Stock;

      stockRepository.create.mockReturnValue(newStock);
      stockRepository.save = jest.fn().mockResolvedValue(newStock);

      const result = await service.createStock(stockValue);

      expect(result).toEqual(newStock);
      expect(stockRepository.create).toHaveBeenCalledWith({ stock: stockValue });
      expect(stockRepository.save).toHaveBeenCalledWith(newStock);
    });
  });

  describe('updateStock', () => {
    it('should update a stock', async () => {
      const stock = { id: '1', stock: 10 } as Stock;
      const updatedStock = { ...stock, stock: 20 };

      stockRepository.save = jest.fn().mockResolvedValue(updatedStock);

      const result = await service.updateStock(stock, 20);

      expect(result).toEqual(updatedStock);
      expect(stockRepository.save).toHaveBeenCalledWith(updatedStock);
    });
  });

  describe('updateSoldUnits', () => {
    it('should update sold units', async () => {
      const product = { id: '1', stock: { id: '1', unities_sold: 10 } } as Product;
      const updatedStock = { ...product.stock, unities_sold: 11 };

      jest.spyOn(service, 'getProductById').mockResolvedValue(product);
      stockRepository.save = jest.fn().mockResolvedValue(updatedStock);

      const result = await service.updateSoldUnits(product.id);

      expect(result).toEqual(updatedStock);
      expect(service.getProductById).toHaveBeenCalledWith(product.id);
      expect(stockRepository.save).toHaveBeenCalledWith(updatedStock);
    });
  });

  // CRUD REVIEW
  describe('createReview', () => {
    it('should create a new review', async () => {
      const createReviewDto = { productId: '1', userId: '1', score: 5, comment: 'Great product' } as CreateReviewDto;
      const product = { id: '1', reviews: [], rating: 0 } as Product;
      const user = { id: '1' } as any; // Assuming a User entity or mock object
      const newReview = { id: '1', ...createReviewDto, product, user } as Review;

      jest.spyOn(service, 'getProductById').mockResolvedValue(product);
      jest.spyOn(service['userService'], 'findUserById').mockResolvedValue(user); // Assuming a userService mock
      reviewRepository.create.mockReturnValue(newReview);
      reviewRepository.save = jest.fn().mockResolvedValue(newReview);
      productRepository.save = jest.fn().mockResolvedValue(product);

      const result = await service.createReview(createReviewDto);

      expect(result).toEqual(newReview);
      expect(service.getProductById).toHaveBeenCalledWith(createReviewDto.productId);
      expect(service['userService'].findUserById).toHaveBeenCalledWith(createReviewDto.userId);
      expect(reviewRepository.create).toHaveBeenCalledWith({ ...createReviewDto, product, user });
      expect(reviewRepository.save).toHaveBeenCalledWith(newReview);
      expect(productRepository.save).toHaveBeenCalledWith(product);
    });

    it('should throw BadRequestException when user is not found', async () => {
      const createReviewDto = { productId: '1', userId: '1', score: 5, comment: 'Great product' } as CreateReviewDto;
      const product = { id: '1', reviews: [], rating: 0 } as Product;

      jest.spyOn(service, 'getProductById').mockResolvedValue(product);
      jest.spyOn(service['userService'], 'findUserById').mockResolvedValue(null); // Assuming a userService mock

      await expect(service.createReview(createReviewDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getAllReviews', () => {
    it('should return all reviews', async () => {
      const reviews = [{ id: '1', comment: 'Great product' }] as Review[];
      const total = reviews.length;

      reviewRepository.findAndCount = jest.fn().mockResolvedValue([reviews, total]);

      const result = await service.getAllReviews('1', '10');

      expect(result).toEqual([reviews, total]);
      expect(reviewRepository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        relations: { product: true },
      });
    });

    it('should throw BadRequestException on invalid page or limit', async () => {
      await expect(service.getAllReviews('invalid', '10')).rejects.toThrow(BadRequestException);
      await expect(service.getAllReviews('1', 'invalid')).rejects.toThrow(BadRequestException);
      await expect(service.getAllReviews('-1', '10')).rejects.toThrow(BadRequestException);
      await expect(service.getAllReviews('1', '-10')).rejects.toThrow(BadRequestException);
    });
  });

  describe('getReviewById', () => {
    it('should return a review by id', async () => {
      const review = { id: '1', comment: 'Great product' } as Review;

      reviewRepository.findOne = jest.fn().mockResolvedValue(review);

      const result = await service.getReviewById('1');

      expect(result).toEqual(review);
      expect(reviewRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: { user: true, product: true },
      });
    });

    it('should throw NotFoundException when review is not found', async () => {
      reviewRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.getReviewById('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getReviewsByProductId', () => {
    it('should return reviews by product id', async () => {
      const product = { id: '1', reviews: [{ id: '1', comment: 'Great product' }] } as Product;
      const total = product.reviews.length;
      const paginatedReviews = product.reviews;

      productRepository.findOne = jest.fn().mockResolvedValue(product);

      const result = await service.getReviewsByProductId('1', '1', '10');

      expect(result).toEqual([paginatedReviews, total]);
      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: { reviews: { user: true } },
      });
    });

    it('should throw BadRequestException on invalid page or limit', async () => {
      await expect(service.getReviewsByProductId('1', 'invalid', '10')).rejects.toThrow(BadRequestException);
      await expect(service.getReviewsByProductId('1', '1', 'invalid')).rejects.toThrow(BadRequestException);
      await expect(service.getReviewsByProductId('1', '-1', '10')).rejects.toThrow(BadRequestException);
      await expect(service.getReviewsByProductId('1', '1', '-10')).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateReview', () => {
    it('should update a review', async () => {
      const updateReviewDto = { comment: 'Updated comment', score: 4 } as UpdateReviewDto;
      const review = { id: '1', comment: 'Great product', score: 5 } as Review;
      const updatedReview = { ...review, ...updateReviewDto };

      jest.spyOn(service, 'getReviewById').mockResolvedValue(review);
      reviewRepository.save = jest.fn().mockResolvedValue(updatedReview);

      const result = await service.updateReview('1', updateReviewDto);

      expect(result).toEqual(updatedReview);
      expect(service.getReviewById).toHaveBeenCalledWith('1');
      expect(reviewRepository.save).toHaveBeenCalledWith(updatedReview);
    });

    it('should throw NotFoundException when review is not found', async () => {
      const updateReviewDto = { comment: 'Updated comment', score: 4 } as UpdateReviewDto;

      jest.spyOn(service, 'getReviewById').mockRejectedValue(new NotFoundException('Review not found'));

      await expect(service.updateReview('1', updateReviewDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteReview', () => {
    it('should delete a review', async () => {
      const deleteResult = { affected: 1 } as DeleteResult;

      reviewRepository.delete = jest.fn().mockResolvedValue(deleteResult);

      const result = await service.deleteReview('1');

      expect(result).toEqual(deleteResult);
      expect(reviewRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when review is not found', async () => {
      reviewRepository.delete = jest.fn().mockRejectedValue(new NotFoundException('Review not found'));

      await expect(service.deleteReview('1')).rejects.toThrow(NotFoundException);
    });
  });
  
});
