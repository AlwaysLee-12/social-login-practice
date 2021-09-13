import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { KakaoAuthGuard } from './kakao-auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  @UseGuards(KakaoAuthGuard)
  @Get('kakao')
  async kakaoLogin() {
    return;
  }

  @UseGuards(KakaoAuthGuard)
  @Get('kakao/callback')
  async callback(@Req() req, @Res() res: Response) {
    if (req.user.type === 'login') {
      res.cookie('access_token', req.user.access_token);
      res.cookie('refresh_token', req.user.refresh_token);
    } else {
      res.cookie('once_token', req.user.once_token);
    }
    res.redirect('http://localhost:3000/auth/signup');
    res.end();
  }
}
