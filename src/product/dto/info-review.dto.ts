import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../entities/product.entity';
import { Review } from '../entities/review.entity';

export class InfoReviewDto {
  @ApiProperty({
    description: 'The unique identifier of the review',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'The title of the review',
    example: 'Great product!',
  })
  title: string;

  @ApiProperty({
    description: 'The score of the review',
    example: 5,
  })
  score: number;

  @ApiProperty({
    description: 'The comment of the review',
    example: 'This product exceeded my expectations.',
  })
  comment: string;

  @ApiProperty({
    description: 'The name of the user who wrote the review',
    example: 'John Doe',
  })
  user: string;

  @ApiProperty({
    description: 'The date when the review was published',
    example: '2023-01-01T00:00:00.000Z',
  })
  publication_date: Date;

  @ApiProperty({
    description: 'The product associated with the review',
    type: () => Product,
  })
  product: Product;

  constructor(review: Review) {
    this.id = review.id;
    this.title = review.title;
    this.score = review.score;
    this.comment = review.comment;
    this.user = `${review.user.first_name} ${review.user.last_name}`;
    this.publication_date = review.publication_date;
    this.product = review.product;
  }
}
