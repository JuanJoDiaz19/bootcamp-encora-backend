import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { AuthClientService } from '../services/auth-client.service';
import { LoginUserDto } from '../dto/login-user.dto';
import { CreateClientDto } from '../dto/create-client.dto';
import { AuthAdminService } from '../services/auth-admin.service';
import { AdminGuard } from '../guards/admin.guard';

import { Roles } from '../decorators/roles.decorator';

@Controller('auth/admin')
export class AuthAdminController {
  constructor(private authService: AuthAdminService) {}

  @Post('register')
  register(@Body() createAuthDto: CreateClientDto) {
    return this.authService.create(createAuthDto);
}


  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  status(@Req() req: Request) {
    //console.log('Inside AuthController status method');
    //console.log(req);
    return req.user;
  }

  @Get('test')
  @UseGuards(AdminGuard)
  test() {
    return "Hello World";
  }
  
}