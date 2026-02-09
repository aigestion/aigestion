import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() credentials: any) {
    return this.authService.validateUser(credentials);
  }

  @Post('refresh')
  refresh(@Body() token: any) {
    return this.authService.refreshToken(token);
  }
}
