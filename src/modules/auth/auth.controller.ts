import {
  Controller,
  Get,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
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
  @Post('kakao')
  async kakaoLogin(@Req() req: any, @Res() res: Response) {
    const kakaoUserData = this.authService.isValidKakaoToken(
      req.headers.access_token,
    );
    if (!kakaoUserData) return;
    let user = await this.authService.validateUser(kakaoUserData.id);
    if (!user) {
      user = await this.authService.createUser(kakaoUserData, 'kakao');
    }
    return this.authService.login(user);
  }

  @Post('apple')
  async appleLogin(@Req() req: any) {
    const appleUserData = this.authService.isValidAppleToken(
      req.headers.access_token,
    );
    if (!appleUserData) return;
    let user = await this.authService.validateUser(appleUserData.id);
    if (!user) {
      user = await this.authService.createUser(appleUserData, 'apple');
    }
    return this.authService.login(user);
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
