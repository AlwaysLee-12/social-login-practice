import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './users.service';
import { User } from '../../entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@ApiTags('User API')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Find Users API', description: 'Find users' })
  @ApiCreatedResponse({ description: 'Find users' })
  findUsers() {
    return this.userService.findAllUser();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Find User API', description: 'Find a user' })
  @ApiCreatedResponse({ description: 'Find a user', type: User })
  findUserById(@Param('id') id: number) {
    return this.userService.findUserById(id);
  }

  @Delete('/:id')
  @ApiOperation({
    summary: 'Delete User',
    description: 'Delete user by user id',
  })
  @ApiCreatedResponse({
    description: 'Delete user by user id',
    type: 'void',
  })
  delete(@Param('id') id: number) {
    return this.userService.deleteById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create User API', description: 'Create User' })
  @ApiCreatedResponse({ description: 'Create User', type: User })
  register(@Body() userData: CreateUserDto) {
    return this.userService.register(userData);
  }

  @Patch('/:id')
  @ApiOperation({
    summary: 'Update User API',
    description: 'Update displayed name of user',
  })
  @ApiCreatedResponse({
    description: 'Update displayed name of user',
    type: User,
  })
  updateDisplayedName(
    @Param('id') id: number,
    @Body() updateUserData: UpdateUserDto,
  ) {
    return this.userService.updateDisplayedNameById(
      id,
      updateUserData.displayed_name,
    );
  }
}
