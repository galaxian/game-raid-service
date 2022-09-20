import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { EndRaidDto } from './dto/end.dto';
import { EnterRaidDto } from './dto/enter.dto';
import { RankDto } from './dto/rank.dto';
import { RaidService } from './raid.service';

@Controller({ path: 'bossraids', version: ['1', '2'] })
export class RaidController {
  constructor(private readonly raidService: RaidService) {}

  @Get()
  getRaidStatus() {
    return this.raidService.getRaidStatus();
  }

  @Post('/enter')
  enterBossRaid(@Body() enterRaidDto: EnterRaidDto) {
    return this.raidService.enterBossRaid(enterRaidDto);
  }

  @Patch('/end')
  endBossRaid(@Body() endRaidDto: EndRaidDto): Promise<void> {
    return this.raidService.endBossRaid(endRaidDto);
  }

  @Get('top-ranker-list')
  getRankList(@Body() rankDto: RankDto) {
    return this.raidService.getRankList(rankDto);
  }
}
