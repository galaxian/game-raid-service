import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ResponseDto } from 'src/utils/dto/response.dto';
import { UserService } from './user.service';

@Controller({ path: '/users', version: ['1', '2'] })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(): Promise<ResponseDto> {
    const data = await this.userService.createUser();
    const response: ResponseDto = {
      status: 201,
      data,
    };
    return response;
  }

  @Get('/:id')
  @UsePipes(ValidationPipe)
  async getUser(@Param('id', ParseIntPipe) id: number): Promise<ResponseDto> {
    const data = await this.userService.getUser(id);
    const response: ResponseDto = {
      status: 200,
      data,
    };
    return response;
  }
}
