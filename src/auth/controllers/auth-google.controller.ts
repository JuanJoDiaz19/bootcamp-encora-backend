import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
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
  async handleRedirect(@Req() req, @Res() res) {
    try {
        const user = await this.authService.handleUserOauth(req.user);
        const front_url = process.env.FRONT_URL || "https://fitnest.online"
        res.redirect( front_url +`/oauth?token=${user.token}`);
    } catch(error) { 
        console.log(error);
    }
  }
}
