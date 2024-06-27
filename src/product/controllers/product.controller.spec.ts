import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from '../services/product.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../entities/product.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { Stock } from '../entities/stock.entity';
import { Category } from '../entities/category.entity';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            createProduct: jest.fn(),
            getActiveProducts: jest.fn(),
            getAllProducts: jest.fn(),
            getProductById: jest.fn(),
            updateProduct: jest.fn(),
            removeProduct: jest.fn(),
            getProductsByCategory: jest.fn(),
            searchProducts: jest.fn(),
            getProductsByGroup: jest.fn(),
            getProductsSortedByPrice: jest.fn(),
            getProductsSortedByRating: jest.fn(),
            getProductsSortedBySoldUnits: jest.fn(),
            getProductsSortedByPriceForCategory: jest.fn(),
            getProductsSortedByRatingForCategory: jest.fn(),
            getProductsSortedBySoldUnitsForCategory: jest.fn(),
            getProductsSortedByPriceForGroup: jest.fn(),
            getProductsSortedByRatingForGroup: jest.fn(),
            getProductsSortedBySoldUnitsForGroup: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
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
      const createdProduct : Product = { 
        id: '1', 
        name: 'Product1',
        description: 'Description1',
        type: 'Type1',
        creation_date: new Date(),
        price: 100,
        stock: new Stock(),
        category: new Category(),
        image_urls: [], 
        rating: 0,
        status: 'Activo',
        reviews: [],
        order_items: [],
        shopping_cart_items:[],
      };
  
      jest.spyOn(service, 'createProduct').mockResolvedValue(createdProduct);
  
      const result = await controller.create(createProductDto, product_images);
  
      expect(result).toEqual(createdProduct);
      expect(service.createProduct).toHaveBeenCalledWith(createProductDto, product_images);
    });
  
    it('should throw BadRequestException on invalid data', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Product1',
        description: 'Description1',
        type:'Type1',
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
  
      jest.spyOn(service, 'createProduct').mockRejectedValue(new BadRequestException());
  
      await expect(controller.create(createProductDto, product_images)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getActiveProducts', () => {
    it('should return active products', async () => {
      const product = { id: '1', name: 'Product1', status: 'Activo' } as Product;
      const products = [product];
      const total = 1;
  
      jest.spyOn(service, 'getActiveProducts').mockResolvedValue([products, total]);
  
      const result = await controller.getActiveProducts('1', '10');
  
      expect(result).toEqual([products, total]);
      expect(service.getActiveProducts).toHaveBeenCalledWith('1', '10');
    });
  
    it('should throw BadRequestException on invalid page or limit', async () => {
      jest.spyOn(service, 'getActiveProducts').mockRejectedValue(new BadRequestException());
  
      await expect(controller.getActiveProducts('invalid', '10')).rejects.toThrow(BadRequestException);
      await expect(controller.getActiveProducts('1', 'invalid')).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('should return a product', async () => {
      const product = { id: '1', name: 'Product1' } as Product;
  
      jest.spyOn(service, 'getProductById').mockResolvedValue(product);
  
      const result = await controller.findOne('1');
  
      expect(result).toEqual(product);
      expect(service.getProductById).toHaveBeenCalledWith('1');
    });
  
    it('should throw NotFoundException when product is not found', async () => {
      jest.spyOn(service, 'getProductById').mockRejectedValue(new NotFoundException());
  
      await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'UpdatedProduct',
        description: 'UpdatedDescription',
        type:'Type1',
        price: 200,
        category: 'Category1',
        image_urls: [],
        stockValue: 20,
      };
      const product_images: Array<Express.Multer.File> = [
        {
          originalname: 'image1.png',
          buffer: Buffer.from(''),
        } as Express.Multer.File,
      ];
      const updatedProduct: Product = { 
        id: '1', 
        name: 'UpdatedProduct',
        description: 'UpdatedDescription',
        type: 'Type1',
        creation_date: new Date(),
        price: 100,
        stock: new Stock(),
        category: new Category(),
        image_urls: [], 
        rating: 0,
        status: 'Activo',
        reviews: [],
        order_items: [],
        shopping_cart_items:[],
      };
  
      jest.spyOn(service, 'updateProduct').mockResolvedValue(updatedProduct);
  
      const result = await controller.update('1', updateProductDto, product_images);
  
      expect(result).toEqual(updatedProduct);
      expect(service.updateProduct).toHaveBeenCalledWith('1', updateProductDto, product_images);
    });
  
    it('should throw NotFoundException when product is not found', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'UpdatedProduct',
        description: 'UpdatedDescription',
        type:'Type1',
        price: 200,
        category: 'Category1',
        image_urls: [],
        stockValue: 20,
      };
      const product_images: Array<Express.Multer.File> = [
        {
          originalname: 'image1.png',
          buffer: Buffer.from(''),
        } as Express.Multer.File,
      ];
  
      jest.spyOn(service, 'updateProduct').mockRejectedValue(new NotFoundException());
  
      await expect(controller.update('1', updateProductDto, product_images)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      const deleteResult = { affected: 1 } as DeleteResult;
  
      jest.spyOn(service, 'removeProduct').mockResolvedValue(deleteResult);
  
      const result = await controller.remove('1');
  
      expect(result).toEqual(deleteResult);
      expect(service.removeProduct).toHaveBeenCalledWith('1');
    });
  
    it('should throw NotFoundException when product is not found', async () => {
      jest.spyOn(service, 'removeProduct').mockRejectedValue(new NotFoundException());
  
      await expect(controller.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
  
});
