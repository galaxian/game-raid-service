import { Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller({ path: '/users', version: ['1', '2'] })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(): Promise<{ userId: number }> {
    return this.userService.createUser();
  }

  @Get('/:id')
  getUser(@Param('id') id: number) {
    return this.userService.getUser(id);
  }
}
