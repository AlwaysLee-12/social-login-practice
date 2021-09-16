import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findUserById(id: number): Promise<User> {
    return await this.userRepository.findOne({ id: id });
  }

  async findUserByKakaoID(user_kakao_id: number): Promise<User> {
    return await this.userRepository.findOne({ kakaoID: user_kakao_id });
  }

  async findAllUser(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async deleteById(id: number): Promise<void> {
    const user = await this.userRepository.findOne({ id: id });
    await this.userRepository.delete(user);
  }

  async createUser(
    kakao_id: number,
    nick_name: string,
    provider: string,
  ): Promise<User> {
    const user = this.userRepository.create({
      kakaoID: kakao_id,
      nick_name: nick_name,
      provider: provider,
    });
    return await this.userRepository.save(user);
  }

  async setUserRefreshToken(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async isRefreshTokenMatching(
    refreshToken: string,
    userID: number,
  ): Promise<User> {
    const user = await this.userRepository.findOne({ id: userID });
    const refreshTokenIsMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );
    if (refreshTokenIsMatching) return user;
    throw new UnauthorizedException();
  }

  async deleteUserRefreshToken(user: User): Promise<void> {
    this.userRepository.update(user, { currentHashedRefreshToken: '' });
  }
}
