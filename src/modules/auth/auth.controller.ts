import { Controller, Get, Headers, Req, Res, UseGuards } from '@nestjs/common';
import { KakaoAuthGuard } from './kakao-auth.guard';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtRefreshGuard } from './jwt-refresh-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(KakaoAuthGuard)
  @Get('kakao')
  async kakaoLogin() {
    return;
  }

  @UseGuards(KakaoAuthGuard)
  @Get('kakao/callback')
  async callback(@Req() req, @Res() res: Response) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refreshToken(@Req() req) {
    const newAccessToken = this.authService.refresh(req.user);
    return { access_token: newAccessToken };
  }
}
