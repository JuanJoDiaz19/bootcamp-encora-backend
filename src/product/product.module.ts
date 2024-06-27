import { Module, forwardRef } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { ProductController } from './controllers/product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { Review } from './entities/review.entity';
import { Stock } from './entities/stock.entity';
import { Group } from './entities/group.entity';
import { CategoryController } from './controllers/category.controller';
import { GroupController } from './controllers/group.controller';
import { ReviewController } from './controllers/review.controller';
import { MulterModule } from '@nestjs/platform-express';
import { User } from 'src/auth/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, Review, Stock, Group]),
    MulterModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [
    ProductController,
    CategoryController,
    GroupController,
    ReviewController,
  ],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
