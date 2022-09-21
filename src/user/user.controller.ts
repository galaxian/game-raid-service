import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ResponseDto } from 'src/utils/dto/response.dto';
import { UserService } from './user.service';

@Controller({ path: '/users', version: ['1', '2'] })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '유저 생성 api',
    description: '중복되지 않는 유저 아이디를 생성한다.',
  })
  @Post()
  async createUser(): Promise<ResponseDto> {
    const data = await this.userService.createUser();
    const response: ResponseDto = {
      status: 201,
      data,
    };
    return response;
  }

  @ApiOperation({
    summary: '유저 정보 조회 api',
    description:
      '유저 pk를 통해 유저의 레이드 총점과 레이드 기록들을 조회한다.',
  })
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
