import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { Group } from '../entities/group.entity';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { DeleteResult } from 'typeorm';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('group')
export class GroupController {
  constructor(private readonly productService: ProductService) {}

  @Post('')
  @UseInterceptors(FileInterceptor('group_image'))
  createGroup(
    @Body() createGroupDto: CreateGroupDto,
    @UploadedFile() group_image: Express.Multer.File,
  ): Promise<Group> {
    return this.productService.createGroup(createGroupDto, group_image);
  }

  @Get('')
  getAllGroups(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<[Group[], number]> {
    return this.productService.getAllGroups(page, limit);
  }

  @Get(':name')
  getGroupByName(@Param('name') name: string): Promise<Group> {
    return this.productService.getGroupByName(name);
  }

  @Get('/id/:id')
  getGroupById(@Param('id') groupId: string): Promise<Group> {
    return this.productService.getGroupById(groupId);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('group_image'))
  updateGroup(
    @Param('id') groupId: string,
    @Body() updateGroupDto: UpdateGroupDto,
    @UploadedFile() group_image: Express.Multer.File,
  ): Promise<Group> {
    return this.productService.updateGroup(
      groupId,
      updateGroupDto,
      group_image,
    );
  }

  @Delete(':id')
  deleteGroup(@Param('id') groupId: string): Promise<DeleteResult> {
    return this.productService.deleteGroup(groupId);
  }
}
