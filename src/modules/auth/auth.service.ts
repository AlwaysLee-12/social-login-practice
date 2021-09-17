import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcrypt';
import { UserService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(provider_id: number): Promise<any> {
    const user = await this.userService.findUserByProviderId(provider_id);
    if (!user) {
      return null;
    }
    return user;
  }

  async login(req: any): Promise<any> {
    const payload = { user_id: req.user.id, user_name: req.user.user_name };
    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: '30m',
    });
    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: '14d',
    });
    const currentHashedRefreshToken = await hash(refresh_token, 10);
    req.user.currentHashedRefreshToken = currentHashedRefreshToken;
    await this.userService.setUserRefreshToken(req.user);
    return { access_token: access_token, refresh_token: refresh_token };
  }

  async logout(user: User): Promise<void> {
    this.userService.deleteUserRefreshToken(user);
  }

  async refresh(user: User): Promise<any> {
    const payload = { user_id: user.id, sub: user.user_name };
    const newAccessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: '30m',
    });
    return newAccessToken;
  }

  async isRefreshTokenMatching(
    refreshToken: string,
    userID: number,
  ): Promise<User> {
    return this.userService.isRefreshTokenMatching(refreshToken, userID);
  }
}
