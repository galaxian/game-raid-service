import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { ResponseDto } from 'src/utils/dto/response.dto';
import { EndRaidDto } from './dto/end.dto';
import { EnterRaidDto } from './dto/enter.dto';
import { RankDto } from './dto/rank.dto';
import { RaidService } from './raid.service';

@Controller({ path: 'bossraids', version: ['1', '2'] })
export class RaidController {
  constructor(private readonly raidService: RaidService) {}

  @Get()
  getRaidStatus(): ResponseDto {
    const data = this.raidService.getRaidStatus();
    const response: ResponseDto = {
      status: 200,
      data,
    };
    return response;
  }

  @Post('/enter')
  enterBossRaid(@Body() enterRaidDto: EnterRaidDto): ResponseDto {
    const data = this.raidService.enterBossRaid(enterRaidDto);
    const response: ResponseDto = {
      status: 201,
      data,
    };
    return response;
  }

  @Patch('/end')
  endBossRaid(@Body() endRaidDto: EndRaidDto): ResponseDto {
    this.raidService.endBossRaid(endRaidDto);
    const response: ResponseDto = {
      status: 200,
    };
    return response;
  }

  @Get('top-ranker-list')
  getRankList(@Body() rankDto: RankDto): ResponseDto {
    const data = this.raidService.getRankList(rankDto);
    const response: ResponseDto = {
      status: 200,
      data,
    };
    return response;
  }
}
