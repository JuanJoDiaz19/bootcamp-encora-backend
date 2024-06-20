import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { Review } from './entities/review.entity';
import { Stock } from './entities/stock.entity';
import { Group } from './entities/group.entity';
import { CategoryController } from './category.controller';
import { GroupController } from './group.controller';
import { ReviewController } from './review.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product,Category,Review,Stock, Group])],
  controllers: [ProductController, CategoryController, GroupController, ReviewController],
  providers: [ProductService],
})
export class ProductModule {}
