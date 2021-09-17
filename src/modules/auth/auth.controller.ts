import { Controller, Get, Put, Req, Res, UseGuards } from '@nestjs/common';
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
  async kakaoLogin1() {
    return;
  }

  @UseGuards(KakaoAuthGuard)
  @Get('kakao/callback')
  async kakaoLogin(@Req() req: any, @Res() res: Response) {
    return await this.authService.login(req.user);
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
  async refreshToken(@Req() req: any) {
    const clientRefreshToken = req.headers.authorization;
    const user = await this.authService.isRefreshTokenMatching(
      clientRefreshToken,
      req.user.userId,
    );
    const newAccessToken = await this.authService.refresh(user);
    return { access_token: newAccessToken };
  }
}
