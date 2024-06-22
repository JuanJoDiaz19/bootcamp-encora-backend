import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { LoginUserDto } from '../dto/login-user.dto';
import { CreateClientDto } from '../dto/create-client.dto';
import { AuthGuard } from '@nestjs/passport';
import { ClientGuard } from '../guards/client.guard';
import { UserService } from '../services/user.service';

@Controller('auth/client')
export class AuthUserController {
  constructor(private authService: UserService) {}

  @Post('register')
  register(@Body() createAuthDto: CreateClientDto) {
    return this.authService.createClient(createAuthDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('password-recovery/:id_user')
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
