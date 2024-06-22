import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { LoginUserDto } from '../dto/login-user.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ClientGuard } from '../guards/client.guard';
import { UserService } from '../services/user.service';
import { AdminGuard } from '../guards/admin.guard';
import { UpdateUserDto } from '../dto/update-user.dto';

@Controller('user/')
export class AuthUserController {
  constructor(private authService: UserService) {}

  @Post('register')
  register(@Body() createAuthDto: CreateUserDto) {
    return this.authService.createUser(createAuthDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('password-recovery/:id_user')
  async recoverPassword(@Param('id_user') id_user: string) {
    try {
      return await this.authService.recoverPassword(id_user);
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
  status(@Req() req: Request) {
    //console.log('Inside AuthController status method');
    //console.log(req.user);
    return req.user;
  }

  @Get('')
  @UseGuards(AdminGuard)
  retriveAllUsers() {
    return this.authService.retriveAllUsers();
  }

  @Put(':id_user')
  @UseGuards(AdminGuard)
  updateUser(@Body() updateUserDto: UpdateUserDto, @Param('id_user') id_user: string) {
    return this.authService.updateUser(updateUserDto, id_user);
  }

  @Get(':id_user')
  @UseGuards(AdminGuard)
  searchById( @Param('id_user') id_user: string) {
    return this.authService.findUserById( id_user);
  }

  @Get('verify_token')
  verifyToken(@Req() req: Request) {
    const token = req.headers.authorization.split(' ')[1];
    return this.authService.verifyToken(token);
  }

  @Get('test')
  @UseGuards(ClientGuard)
  test() {
    //console.log('Inside AuthController status method');
    //console.log(req.user);
    return 'hello world';
  }
}
