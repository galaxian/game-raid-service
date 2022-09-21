import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ResponseDto } from 'src/utils/dto/response.dto';
import { EndRaidDto } from './dto/end.dto';
import { EnterRaidDto } from './dto/enter.dto';
import { RankDto } from './dto/rank.dto';
import { RaidService } from './raid.service';

@Controller({ path: 'bossraids', version: ['1', '2'] })
export class RaidController {
  constructor(private readonly raidService: RaidService) {}

  @Get()
  async getRaidStatus(): Promise<ResponseDto> {
    const data = await this.raidService.getRaidStatus();
    const response: ResponseDto = {
      status: 200,
      data,
    };
    return response;
  }

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

  @Patch('/end')
  @UsePipes(ValidationPipe)
  async endBossRaid(@Body() endRaidDto: EndRaidDto): Promise<ResponseDto> {
    this.raidService.endBossRaid(endRaidDto);
    const response: ResponseDto = {
      status: 200,
    };
    return response;
  }

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
