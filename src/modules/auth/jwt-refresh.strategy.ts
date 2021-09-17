import { Injectable, Req } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserService } from '../users/users.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      IgnoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_TOKEN_SECRET,
    });
  }

  async validate(payload: any) {
    return { userId: payload.user_id, username: payload.user_name };
  }
}
