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

  async register(userData: CreateUserDto): Promise<User> {
    const { email, password, name, displayed_name } = userData;
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    const user = await this.userRepository.create({
      email,
      password,
      name,
      displayed_name,
    });
    user.password = hashedPassword;
    return await this.userRepository.save(user);
  }

  async updateDisplayedNameById(
    id: number,
    displayed_name: string,
  ): Promise<User> {
    const user = await this.userRepository.findOne({ id: id });
    user.displayed_name = displayed_name;
    return await this.userRepository.save(user);
  }
}
