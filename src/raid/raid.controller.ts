import { Controller, Get } from '@nestjs/common';
import { RaidService } from './raid.service';

@Controller({ path: 'bossraids', version: ['1', '2'] })
export class RaidController {
  constructor(private readonly raidService: RaidService) {}

  @Get()
  getRaidStatus() {
    return this.raidService.getRaidStatus();
  }
}
