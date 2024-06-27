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
});
