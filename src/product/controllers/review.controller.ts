import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { DeleteResult } from 'typeorm';
import { Review } from '../entities/review.entity';
import { CreateReviewDto } from '../dto/create-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';
import { InfoReviewDto } from '../dto/info-review.dto';

@Controller('review')
export class ReviewController {
  constructor(private readonly productService: ProductService) {}

  @Post('')
  createReview(@Body() createReviewDto: CreateReviewDto): Promise<Review>{
    return this.productService.createReview(createReviewDto);
  }

  @Get('')
  getAllReviews(@Query('page') page: string, @Query('limit') limit: string): Promise<[Review[],number]>{
    return this.productService.getAllReviews(page,limit);
  }

  @Get('info')
  async getAllReviewsInfo(@Query('page') page: string, @Query('limit') limit: string): Promise<[InfoReviewDto[], number]> {
    const [reviews, total] = await this.productService.getAllReviews(page, limit);
    const infoReviews: InfoReviewDto[] = reviews.map(review => new InfoReviewDto(review));
    return [infoReviews, total];
  }

  @Get(':id')
  getReviewById(@Param('id') id: string): Promise<Review>{
    return this.productService.getReviewById(id);
  }

  @Get('info/:id')
  async getInfoReviewById(@Param('id') id: string): Promise<InfoReviewDto>{
    const review = await this.productService.getReviewById(id);
    const infoReview = new InfoReviewDto(review);
    return infoReview;
  }

  @Patch(':id')
  updateReview(@Param('id') id: string, updateReviewDto: UpdateReviewDto): Promise<Review>{
    return this.productService.updateReview(id, updateReviewDto);
  }

  @Delete(':id')
  deleteReview(@Param('id') id: string): Promise<DeleteResult>{
    return this.productService.deleteReview(id);
  }

}