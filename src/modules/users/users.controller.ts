import { Controller, Delete, Get, Param } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './users.service';
import { User } from '../../entities/user.entity';

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
}
