import { Injectable, Options } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcrypt';
import { UserService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(user_email: string): Promise<any> {
    const user = await this.userService.findUserByEmail(user_email);
    if (!user) {
      return null;
    }
    return user;
  }

  async login(user: User) {
    const payload = { user_id: user.id, user_email: user.email };
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

  async refresh(user: User, refresh_token: string): Promise<any> {
    const payload = { user_id: user.id, sub: user.email };
    const newAccessToken = this.jwtService.sign(payload);
    return newAccessToken;
  }
}
