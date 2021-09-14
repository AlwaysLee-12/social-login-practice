import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { User } from 'src/entities/user.entity';
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
  ): Promise<User> {
    const user_email = profile._json.email;
    const user_nickname = profile._json.nickname;
    const user_provider = profile.provider;

    //console.log(user_profile);

    let user = await this.authService.validateUser(user_email);
    if (!user) {
      const newUserData = { user_email, user_nickname, user_provider };
      user = this.userService.createUser(newUserData);
    }
    return user;
  }
}
