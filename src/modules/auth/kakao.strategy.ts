import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { AuthService } from './auth.service';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      callbackURL: process.env.KAKAO_CALLBACK_URL,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    const user_email = profile._json.email;
    const user_nickname = profile._json.nickname;
    const user_provider = profile.provider;
    const user_profile = {
      user_email,
      user_nickname,
      user_provider,
    };

    console.log(user_profile);

    const user = await this.authService.validateUser(user_email);
    if (!user) {
      this.authService.createUser(user_profile);
    }
    const access_token = await this.authService.createLoginToken(user);
    // const refresh_token = await this.authService.createRefreshToken(user);
    return { access_token, type: 'login' }; //refresh_token
  }
}
