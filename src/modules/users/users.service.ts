import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
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

  async findAllUser(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async deleteById(id: number): Promise<void> {
    const user = await this.userRepository.findOne({ id: id });
    await this.userRepository.delete(user);
  }
}
