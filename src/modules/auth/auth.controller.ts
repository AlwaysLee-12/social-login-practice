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

  @Get('kakao')
  async kakaoLogin(@Req() req: any, @Res() res: Response) {
    const kakaoUserData = await this.authService.isValidKakaoToken(
      req.headers.authorization,
    );
    console.log(kakaoUserData);
    if (!kakaoUserData) return;
    let user = await this.authService.validateUser(kakaoUserData.id, kakaoUserData.provider);
    if (!user) {
      user = await this.authService.createUser(kakaoUserData.id, kakaoUserData.profile.username, kakaoUserData.provider);
    }
    return this.authService.login(user);
  }

  // @Post('apple')
  // async appleLogin(@Req() req: any) {
  //   const appleUserData = this.authService.isValidAppleToken(
  //     req.headers.authorization,
  //   );
  //   if (!appleUserData) return;
  //   let user = await this.authService.validateUser(appleUserData.id, appleUserData.provider);
  //   if (!user) {
  //     user = await this.authService.createUser(appleUserData.id, appleUserData.provider, appleUserData.provider);
  //   }
  //   return this.authService.login(user);
  // }

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
