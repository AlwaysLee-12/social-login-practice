import { Controller, Get, Put, Req, Res, UseGuards } from '@nestjs/common';
import { KakaoAuthGuard } from './kakao-auth.guard';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtRefreshGuard } from './jwt-refresh-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @UseGuards(KakaoAuthGuard)
  // @Get('kakao')
  // async kakaoLogin() {
  //   return;
  // }

  @UseGuards(KakaoAuthGuard)
  @Get('kakao')
  async kakaoLogin(@Req() req: any, @Res() res: Response) {
    this.authService.isValidToken(
      req.access_token_kakao,
      req.headers.access_token,
    );
    return this.authService.login(req.user);
  }

  @Put('logout')
  async logout(@Req() req: any): Promise<void> {
    this.authService.logout(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: any) {
    return req.user;
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refreshToken(@Req() req: any) {
    const newAccessToken = this.authService.refresh(req.user);
    return { access_token: newAccessToken };
  }
}
