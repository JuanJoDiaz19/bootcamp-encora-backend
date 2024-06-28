import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { DeleteResult } from 'typeorm';
import { Review } from '../entities/review.entity';
import { CreateReviewDto } from '../dto/create-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';
import { InfoReviewDto } from '../dto/info-review.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';

@ApiTags('review')
@Controller('review')
export class ReviewController {
  constructor(private readonly productService: ProductService) {}

  @Post('')
  @ApiOperation({ summary: 'Create a new review' })
  @ApiResponse({ status: 201, description: 'Review created successfully', type: Review })
  @ApiBody({ type: CreateReviewDto })
  createReview(@Body() createReviewDto: CreateReviewDto): Promise<Review> {
    return this.productService.createReview(createReviewDto);
  }

  @Get('')
  @ApiOperation({ summary: 'Get all reviews' })
  @ApiResponse({ status: 200, description: 'List of all reviews', type: [Review] })
  @ApiQuery({ name: 'page', required: false, type: String, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: String, description: 'Limit number of reviews per page' })
  getAllReviews(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<[Review[], number]> {
    return this.productService.getAllReviews(page, limit);
  }

  @Get('info')
  @ApiOperation({ summary: 'Get all reviews with detailed information' })
  @ApiResponse({ status: 200, description: 'List of all reviews with detailed information', type: [InfoReviewDto] })
  @ApiQuery({ name: 'page', required: false, type: String, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: String, description: 'Limit number of reviews per page' })
  async getAllReviewsInfo(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<[InfoReviewDto[], number]> {
    const [reviews, total] = await this.productService.getAllReviews(
      page,
      limit,
    );
    const infoReviews: InfoReviewDto[] = reviews.map(
      (review) => new InfoReviewDto(review),
    );
    return [infoReviews, total];
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a review by ID' })
  @ApiResponse({ status: 200, description: 'The review with the given ID', type: Review })
  @ApiParam({ name: 'id', type: String, description: 'ID of the review' })
  getReviewById(@Param('id') id: string): Promise<Review> {
    return this.productService.getReviewById(id);
  }

  @Get('info/:id')
  @ApiOperation({ summary: 'Get detailed information of a review by ID' })
  @ApiResponse({ status: 200, description: 'Detailed information of the review with the given ID', type: InfoReviewDto })
  @ApiParam({ name: 'id', type: String, description: 'ID of the review' })
  async getInfoReviewById(@Param('id') id: string): Promise<InfoReviewDto> {
    const review = await this.productService.getReviewById(id);
    const infoReview = new InfoReviewDto(review);
    return infoReview;
  }

  @Get('product/:id')
  @ApiOperation({ summary: 'Get reviews by product ID' })
  @ApiResponse({ status: 200, description: 'List of reviews for the given product ID', type: [InfoReviewDto] })
  @ApiParam({ name: 'id', type: String, description: 'ID of the product' })
  @ApiQuery({ name: 'page', required: false, type: String, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: String, description: 'Limit number of reviews per page' })
  async getReviewsByProductId(
    @Param('id') id: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<[InfoReviewDto[], number]> {
    const [reviews, total] = await this.productService.getReviewsByProductId(
      id,
      page,
      limit,
    );
    const infoReviews: InfoReviewDto[] = reviews.map(
      (review) => new InfoReviewDto(review),
    );
    return [infoReviews, total];
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a review by ID' })
  @ApiResponse({ status: 200, description: 'Review updated successfully', type: Review })
  @ApiParam({ name: 'id', type: String, description: 'ID of the review to update' })
  @ApiBody({ type: UpdateReviewDto })
  updateReview(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<Review> {
    return this.productService.updateReview(id, updateReviewDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a review by ID' })
  @ApiResponse({ status: 200, description: 'Review deleted successfully', type: DeleteResult })
  @ApiParam({ name: 'id', type: String, description: 'ID of the review to delete' })
  deleteReview(@Param('id') id: string): Promise<DeleteResult> {
    return this.productService.deleteReview(id);
  }
}
