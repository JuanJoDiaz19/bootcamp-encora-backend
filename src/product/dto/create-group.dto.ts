import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupDto {
  @ApiProperty({
    description: 'The name of the group',
    example: 'Technology',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'A brief description of the group',
    example: 'Group for all technology-related categories',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The URL of the group image',
    example: 'https://example.com/images/technology.png',
  })
  @IsString()
  image_url: string;
}
