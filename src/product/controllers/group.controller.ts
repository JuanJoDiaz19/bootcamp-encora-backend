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
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('group')
@Controller('group')
export class GroupController {
  constructor(private readonly productService: ProductService) {}

  @Post('')
  @UseInterceptors(FileInterceptor('group_image'))
  @ApiOperation({ summary: 'Create a new group' })
  @ApiResponse({ status: 201, description: 'Group created successfully.', type: Group })
  @ApiBody({ type: CreateGroupDto })
  createGroup(
    @Body() createGroupDto: CreateGroupDto,
    @UploadedFile() group_image: Express.Multer.File,
  ): Promise<Group> {
    return this.productService.createGroup(createGroupDto, group_image);
  }

  @Get('')
  @ApiOperation({ summary: 'Get all groups' })
  @ApiResponse({ status: 200, description: 'List of groups', type: [Group] })
  @ApiQuery({ name: 'page', required: false, type: String, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: String, description: 'Limit number of groups per page' })
  getAllGroups(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<[Group[], number]> {
    return this.productService.getAllGroups(page, limit);
  }

  @Get(':name')
  @ApiOperation({ summary: 'Get group by name' })
  @ApiResponse({ status: 200, description: 'Group found', type: Group })
  @ApiResponse({ status: 404, description: 'Group not found' })
  @ApiParam({ name: 'name', type: String, description: 'Name of the group' })
  getGroupByName(@Param('name') name: string): Promise<Group> {
    return this.productService.getGroupByName(name);
  }

  @Get('/id/:id')
  @ApiOperation({ summary: 'Get group by ID' })
  @ApiResponse({ status: 200, description: 'Group found', type: Group })
  @ApiResponse({ status: 404, description: 'Group not found' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the group' })
  getGroupById(@Param('id') groupId: string): Promise<Group> {
    return this.productService.getGroupById(groupId);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('group_image'))
  @ApiOperation({ summary: 'Update group' })
  @ApiResponse({ status: 200, description: 'Group updated successfully.', type: Group })
  @ApiResponse({ status: 404, description: 'Group not found' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the group' })
  @ApiBody({ type: UpdateGroupDto })
  updateGroup(
    @Param('id') groupId: string,
    @Body() updateGroupDto: UpdateGroupDto,
    @UploadedFile() group_image: Express.Multer.File,
  ): Promise<Group> {
    return this.productService.updateGroup(groupId, updateGroupDto, group_image);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete group' })
  @ApiResponse({ status: 200, description: 'Group deleted successfully.', type: DeleteResult })
  @ApiResponse({ status: 404, description: 'Group not found' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the group' })
  deleteGroup(@Param('id') groupId: string): Promise<DeleteResult> {
    return this.productService.deleteGroup(groupId);
  }
}
