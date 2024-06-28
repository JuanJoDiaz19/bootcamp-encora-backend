import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UserService } from "../services/user.service";

@Controller('auth/google')
export class AuthGoogleController {

    constructor(private authService: UserService) {}

    @Get('login')
    @UseGuards(AuthGuard('google'))
    handleGoogleLogin(){
        return {msg: "google authentication"};
    }
    @Get('redirect')
    @UseGuards(AuthGuard('google'))
    handleRedirect(@Req() req){
        return this.authService.handleUserOauth(req.user);
    }
}