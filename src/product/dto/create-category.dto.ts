import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'The name of the category',
    example: 'Electronics',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'A brief description of the category',
    example: 'Category for all electronic products',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The UUID of the group to which the category belongs',
    example: 'a8098c1a-f86e-11da-bd1a-00112444be1e',
  })
  @IsNotEmpty()
  @IsUUID()
  groupName: string;

  @ApiProperty({
    description: 'The URL of the category image',
    example: 'https://example.com/images/electronics.png',
  })
  @IsString()
  image_url: string;
}
