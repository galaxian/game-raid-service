import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseDto } from 'src/utils/dto/response.dto';
import { EndRaidDto } from './dto/end.dto';
import { EnterRaidDto } from './dto/enter.dto';
import { RankDto } from './dto/rank.dto';
import { RaidService } from './raid.service';

@ApiTags('보스 레이드 관련 api')
@Controller({ path: 'bossraids', version: ['1', '2'] })
export class RaidController {
  constructor(private readonly raidService: RaidService) {}

  @ApiOperation({
    summary: '보스 레이드 상태 조회 api',
    description: '보스 레이드를 진행중인 사용자가 있는지 확인한다.',
  })
  @Get()
  async getRaidStatus(): Promise<ResponseDto> {
    const data = await this.raidService.getRaidStatus();
    const response: ResponseDto = {
      status: 200,
      data,
    };
    return response;
  }

  @ApiOperation({
    summary: '보스 레이드 입장 api',
    description:
      '보스 레이드 상태를 확인하고 입장 가능하면 입장, 불가능하면 입장이 불가능하도록 한다.',
  })
  @Post('/enter')
  @UsePipes(ValidationPipe)
  async enterBossRaid(
    @Body() enterRaidDto: EnterRaidDto,
  ): Promise<ResponseDto> {
    const data = await this.raidService.enterBossRaid(enterRaidDto);
    const response: ResponseDto = {
      status: 201,
      data,
    };
    return response;
  }

  @ApiOperation({
    summary: '보스 레이드 종료 api',
    description:
      '보스 레이드를 진행중인 사용자가 레이드 종료시 종료할 수 있도록 한다.',
  })
  @Patch('/end')
  @UsePipes(ValidationPipe)
  async endBossRaid(@Body() endRaidDto: EndRaidDto): Promise<ResponseDto> {
    this.raidService.endBossRaid(endRaidDto);
    const response: ResponseDto = {
      status: 200,
    };
    return response;
  }

  @ApiOperation({
    summary: '보스 레이드 랭킹 조회 api',
    description:
      '보스 레이드 랭킹 리스트 및 본인의 랭킹 정보를 확인할 수 있다.',
  })
  @Get('top-ranker-list')
  @UsePipes(ValidationPipe)
  async getRankList(@Body() rankDto: RankDto): Promise<ResponseDto> {
    const data = await this.raidService.getRankList(rankDto);
    const response: ResponseDto = {
      status: 200,
      data,
    };
    return response;
  }
}
