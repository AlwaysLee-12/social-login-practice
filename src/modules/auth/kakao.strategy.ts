import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { UserService } from '../users/users.service';
import { AuthService } from './auth.service';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
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
    const provider = profile.provider;
    const provider_id = profile.id;
    const user_name = profile.username;

    let user = await this.authService.validateUser(provider_id);
    if (!user) {
      const newUserData = { provider_id, user_name, provider };
      user = await this.userService.createUser(newUserData);
    }
    return { access_token_kakao: accessToken, user: user };
  }
}
