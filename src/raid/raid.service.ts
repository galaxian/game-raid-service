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

  async getBossInfo() {
    const url = bossUrl;

    const responseData = await axios.get(url);

    return responseData.data;
  }
}
