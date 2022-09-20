import { Controller, Get, Param, Post } from '@nestjs/common';
import { ResponseDto } from 'src/utils/dto/response.dto';
import { UserService } from './user.service';

@Controller({ path: '/users', version: ['1', '2'] })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(): ResponseDto {
    const data = this.userService.createUser();
    const response: ResponseDto = {
      status: 201,
      data,
    };
    return response;
  }

  @Get('/:id')
  getUser(@Param('id') id: number): ResponseDto {
    const data = this.userService.getUser(id);
    const response: ResponseDto = {
      status: 200,
      data,
    };
    return response;
  }
}
