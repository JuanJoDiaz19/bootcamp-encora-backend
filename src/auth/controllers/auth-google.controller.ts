import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../services/user.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth/google')
@Controller('auth/google')
export class AuthGoogleController {
  constructor(private authService: UserService) {}

  @Get('login')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google login' })
  @ApiResponse({ status: 200, description: 'Initiates Google authentication' })
  handleGoogleLogin() {
    return { msg: 'Google authentication' };
  }

  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google redirect' })
  @ApiResponse({ status: 200, description: 'Handles Google OAuth redirect and processes the user' })
  handleRedirect(@Req() req) {
    return this.authService.handleUserOauth(req.user);
  }
}
