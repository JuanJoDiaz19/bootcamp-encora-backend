import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { Group } from '../entities/group.entity';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { DeleteResult } from 'typeorm';

@Controller('group')
export class GroupController {
  constructor(private readonly productService: ProductService) {}

  @Post('')
  createGroup(@Body() createGroupDto: CreateGroupDto): Promise<Group>{
    return this.productService.createGroup(createGroupDto);
  }

  @Get('')
  getAllGroups(@Query('page') page: string, @Query('limit') limit: string): Promise<[Group[],number]>{
    return this.productService.getAllGroups(page,limit);
  }

  @Get(':id')
  getGroupById(@Param('id') groupId: string): Promise<Group>{
    return this.productService.getGroupById(groupId);
  }

  @Patch(':id')
  updateGroup(@Param('id') groupId: string, updateGroupDto: UpdateGroupDto): Promise<Group>{
    return this.productService.updateGroup(groupId, updateGroupDto);
  }

  @Delete(':id')
  deleteGroup(@Param('id') groupId: string): Promise<DeleteResult>{
    return this.productService.deleteGroup(groupId);
  }

}