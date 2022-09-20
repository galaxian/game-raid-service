import { Controller, Get, Param, Post } from '@nestjs/common';
import { ResponseDto } from 'src/utils/dto/response.dto';
import { UserService } from './user.service';

@Controller({ path: '/users', version: ['1', '2'] })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(): Promise<ResponseDto> {
    return this.userService.createUser();
  }

  @Get('/:id')
  getUser(@Param('id') id: number): Promise<ResponseDto> {
    return this.userService.getUser(id);
  }
}
