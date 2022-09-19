import { Body, Controller, Get, Post } from '@nestjs/common';
import { EnterRaidDto } from './dto/enter.dto';
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
}
