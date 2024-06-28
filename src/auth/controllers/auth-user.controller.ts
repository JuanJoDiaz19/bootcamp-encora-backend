import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { LoginUserDto } from '../dto/login-user.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { ClientGuard } from '../guards/client.guard';
import { UserService } from '../services/user.service';
import { AdminGuard } from '../guards/admin.guard';
import { UpdateUserDto } from '../dto/update-user.dto';
import { AuthUser } from '../entities/authUser.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user/')
export class AuthUserController {
  constructor(private authService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: CreateUserDto })
  register(@Body() createAuthDto: CreateUserDto) {
    return this.authService.createUser(createAuthDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: LoginUserDto })
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('password-recovery')
  @ApiOperation({ summary: 'Recover password' })
  @ApiResponse({ status: 200, description: 'Password recovery email sent' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ schema: { type: 'object', properties: { email: { type: 'string' } } } })
  async recoverPassword(@Body() email: any) {
    try {
      return await this.authService.recoverPassword(email.email);
    } catch (error) {
      return {
        success: false,
        message: 'An error occurred while recovering the password.',
        error: error.message || error.toString(),
      };
    }
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user status' })
  @ApiResponse({ status: 200, description: 'User status retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  status(@Req() req: Request) {
    const user = req.user as AuthUser;
    return this.authService.findUserById(user.id);
  }

  @Get('')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  retriveAllUsers() {
    return this.authService.retriveAllUsers();
  }

  @Put(':id_user')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'User successfully updated' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBody({ type: UpdateUserDto })
  @ApiParam({ name: 'id_user', required: true, description: 'User ID' })
  updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id_user') id_user: string,
  ) {
    return this.authService.updateUser(updateUserDto, id_user);
  }

  @Get(':id_user')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Search user by ID' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiParam({ name: 'id_user', required: true, description: 'User ID' })
  searchById(@Param('id_user') id_user: string) {
    return this.authService.findUserById(id_user);
  }

  @Get('verify_token')
  @ApiOperation({ summary: 'Verify token' })
  @ApiResponse({ status: 200, description: 'Token is valid' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  verifyToken(@Req() req: Request) {
    const token = req.headers.authorization.split(' ')[1];
    return this.authService.verifyToken(token);
  }

  /*@Get('test')
  @UseGuards(ClientGuard)
  test() {
    return 'hello world';
  }*/

  @Get(':userId/:productId')
  @ApiOperation({ summary: 'Check if user has product in approved orders' })
  @ApiResponse({ status: 200, description: 'Checked successfully' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiParam({ name: 'userId', required: true, description: 'User ID' })
  @ApiParam({ name: 'productId', required: true, description: 'Product ID' })
  async userHasProductInApprovedOrders(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ): Promise<{ hasProduct: boolean }> {
    const hasProduct = await this.authService.userHasProductInApprovedOrders(userId, productId);
    return { hasProduct };
  }
}
