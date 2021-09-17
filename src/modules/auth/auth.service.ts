import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcrypt';
import { UserService } from '../users/users.service';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
  ) {}

  async validateUser(user_id: number): Promise<any> {
    const user = await this.userService.findUserById(user_id);
    if (!user) {
      return null;
    }
    return user;
  }

  async isValidKakaoToken(access_token_kakao: string): Promise<any> {
    const api_url = 'https://kapi.kakao.com/v1/user/me';
    const header = {
      Authorization: `bearer ${access_token_kakao}`,
    };
    if (!access_token_kakao) {
      throw new UnauthorizedException();
    }
    return this.httpService.post(api_url, '', { headers: header }); //확인 후 수정
  }

  async isValidAppleToken(access_token_apple: string): Promise<any> {
    const api_url = '애플 url'; //추가하기
    const header = {
      Authorization: `bearer ${access_token_apple}`, //확인 후 수정
    };
    if (!access_token_apple) {
      throw new UnauthorizedException();
    }
    return this.httpService.post(api_url, '', { headers: header }); //확인 후 수정
  }

  async createUser(userData: any, provider: string): Promise<User> {
    if (provider === 'kakao') {
      const nick_name = userData.kakao_account.profile.nickname;
      return await this.userService.createUser(
        userData.id,
        nick_name,
        provider,
      );
    }
    return await this.userService.createUser(
      //애플에서는 어떻게 넘어오는지 확인 후 수정
      userData.id,
      userData.nick_name,
      provider,
    );
  }

  async login(user: User) {
    const payload = { user_id: user.id, user_nickname: user.nick_name };
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
    const payload = { user_id: user.id, sub: user.nick_name };
    const newAccessToken = this.jwtService.sign(payload);
    return newAccessToken;
  }
}
