import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcrypt';
import { UserService } from '../users/users.service';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
  ) {}

  async validateUser(provider_id: number, provider: string): Promise<any> {
    const user = await this.userService.findUserByProviderIdAndProvider(
      provider_id,
      provider,
    );
    if (!user) {
      return null;
    }
    return user;
  }

  async isValidKakaoToken(access_token_kakao: string): Promise<any> {
    const api_url = 'https://kapi.kakao.com/v2/user/me';
    const header = {
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      'Authorization': `${access_token_kakao}`,
    };

    if (!access_token_kakao) {
      throw new UnauthorizedException();
    }
    return this.httpService.get(api_url, { headers: header }); //observable {subscribe: ~} 데이터 추출하는 법 강구
  }

  async isValidAppleToken(access_token_apple: string): Promise<any> {
    const api_url = '애플 url'; //추가하기
    const header = {
      Authorization: `Bearer ${access_token_apple}`, //확인 후 수정
    };
    if (!access_token_apple) {
      throw new UnauthorizedException();
    }
    return this.httpService.get(api_url, { headers: header }); //확인 후 수정
  }

  async createUser(
    provider_id: number,
    user_name: string,
    provider: string,
  ): Promise<User> {
    return await this.userService.createUser(provider_id, user_name, provider);
  }

  async login(user: User) {
    const payload = { user_id: user.id, user_name: user.user_name };
    const access_token = this.jwtService.sign(payload);
    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION,
    });

    const currentHashedRefreshToken = await hash(refresh_token, 10);
    user.currentHashedRefreshToken = currentHashedRefreshToken;
    await this.userService.setUserRefreshToken(user);
    return { access_token: access_token, refresh_token: refresh_token };
  }

  async logout(user: User): Promise<void> {
    this.userService.deleteUserRefreshToken(user);
  }

  async refresh(user: User): Promise<any> {
    const payload = { user_id: user.id, sub: user.user_name };
    const newAccessToken = this.jwtService.sign(payload);
    return newAccessToken;
  }
}
