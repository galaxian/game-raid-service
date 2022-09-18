import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RaidRecord } from './entity/raid.entity';
import * as config from 'config';
import axios from 'axios';

const bossUrl = config.get('boss_url');

@Injectable()
export class RaidService {
  constructor(
    @InjectRepository(RaidRecord)
    private readonly raidRepository: Repository<RaidRecord>,
  ) {}

  async getRaidStatus() {
    const getRecord = await this.raidRepository.find();

    if (getRecord.length === 0) {
      return { canEnter: true, enteredUserId: null };
    }

    const enterTime = getRecord[0].enterTime.getTime();
    const now = new Date().getTime();

    const duration = await this.getBossInfo()['bossRaidLimitSeconds'];

    if (now - enterTime < duration * 1000) {
      return {
        canEnter: false,
        enteredUserId: getRecord[0].user.id,
      };
    }

    return {
      canEnter: true,
      enteredUserId: null,
    };
  }

  async getBossInfo() {
    const url = bossUrl;

    const responseData = await axios.get(url);

    return responseData.data;
  }
}
