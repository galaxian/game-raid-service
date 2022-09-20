import {
  BadRequestException,
  CACHE_MANAGER,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RaidRecord } from './entity/raid.entity';
import * as config from 'config';
import axios from 'axios';
import { EnterRaidDto } from './dto/enter.dto';
import { UserService } from 'src/user/user.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map } from 'rxjs';
import { EndRaidDto } from './dto/end.dto';
import { User } from 'src/user/entity/user.entity';
import { Cache } from 'cache-manager';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { RankDto } from './dto/rank.dto';
import { EnterResponseDto } from './dto/enterRes.dto';
import { ResponseDto } from 'src/utils/dto/response.dto';
import { RaidRankResponseDto } from './dto/raidRankRes.dto';
import { RaidStatusEnterResponseDto } from './dto/raidStatusRes.enter.dto';

const bossUrl = config.get('boss_url');

@Injectable()
export class RaidService {
  constructor(
    @InjectRepository(RaidRecord)
    private readonly raidRepository: Repository<RaidRecord>,
    private readonly userService: UserService,
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async getRaidStatus(): Promise<RaidStatusEnterResponseDto> {
    const getRecord: RaidRecord[] = await this.raidRepository.find({
      relations: ['user'],
      order: { endTime: 'DESC' },
    });

    if (getRecord.length === 0) {
      const result: RaidStatusEnterResponseDto = {
        canEnter: true,
      };
      return result;
    }

    const enterTime: number = getRecord[0].enterTime.getTime();
    const now = new Date().getTime();

    const duration: number = (await this.getBossInfo()).bossRaids[0]
      .bossRaidLimitSeconds;

    if (now - enterTime < duration * 1000) {
      const result: RaidStatusEnterResponseDto = {
        canEnter: false,
        enteredUserId: getRecord[0].user.id,
      };
      return result;
    }

    const result: RaidStatusEnterResponseDto = {
      canEnter: true,
    };

    return result;
  }

  async enterBossRaid(enterRaidDto: EnterRaidDto): Promise<EnterResponseDto> {
    const { userId, level } = enterRaidDto;

    const findUser: User = await this.userService.findUserByfield({
      where: {
        id: userId,
      },
    });

    if (!findUser) {
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }

    const canEnter: boolean = (await this.getRaidStatus()).canEnter;

    if (!canEnter) {
      const data: EnterResponseDto = { isEntered: false, raidRecordId: null };
      return data;
    }

    const record: RaidRecord = this.raidRepository.create({
      level,
      user: findUser,
    });

    const saveRecord: RaidRecord = await this.raidRepository.save(record);

    const data: EnterResponseDto = {
      isEntered: true,
      raidRecordId: saveRecord.id,
    };

    return data;
  }

  async endBossRaid(endRaidDto: EndRaidDto): Promise<void> {
    const { userId, raidRecordId } = endRaidDto;

    const findUser: User = await this.userService.findUserByfield({
      where: { id: userId },
    });

    if (!findUser) {
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }

    const raidRecord: RaidRecord = await this.raidRepository.findOne({
      where: { id: raidRecordId },
      relations: ['user'],
    });

    if (!raidRecord) {
      throw new NotFoundException('존재하지 않는 레이드입니다.');
    }

    if (raidRecord.user.id !== userId) {
      throw new ForbiddenException('본인의 레이드 정보가 아닙니다.');
    }

    const now: Date = new Date();
    raidRecord.endTime = now;

    const bossRadiDuration: number = (await this.getBossInfo()).bossRaids[0]
      .bossRaidLimitSeconds;
    const bossRaidScore: number = (await this.getBossInfo()).bossRaids[0]
      .levels[raidRecord.level - 1];

    const playerRaidTime: number =
      raidRecord.endTime.getTime() - raidRecord.enterTime.getTime();

    if (playerRaidTime < bossRadiDuration * 1000) {
      raidRecord.score = bossRaidScore;
    }

    await this.raidRepository.save(raidRecord);

    await this.redis.zincrby(
      'raidRank',
      parseInt(bossRaidScore['score']),
      userId,
    );
  }

  async getRankList(rankDto: RankDto): Promise<{
    topRankerInfoList: RaidRankResponseDto[];
    myRankingInfo: RaidRankResponseDto;
  }> {
    const { userId } = rankDto;

    const findUser: User = await this.userService.findUserByfield({
      where: { id: userId },
    });

    if (!findUser) {
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }

    const rankList = await this.redis.zrevrange('raidRank', 0, -1);
    const results: RaidRankResponseDto[] = await Promise.all(
      rankList.map(async (element) => {
        const score = await this.redis.zscore('raidRank', element);
        const rank = await this.redis.zrevrank('raidRank', element);
        const result: RaidRankResponseDto = {
          ranking: rank + 1,
          userId: Number(element),
          totalScore: Number(score),
        };
        return result;
      }),
    );

    let myRank = 0;
    let myTotalScore = 0;

    for (const rank of results) {
      if (userId === rank.userId) {
        myRank = rank.ranking;
        myTotalScore = rank.totalScore;
        break;
      }
    }

    const myRaidRankData: RaidRankResponseDto = {
      ranking: myRank,
      userId,
      totalScore: myTotalScore,
    };

    const data = {
      topRankerInfoList: results,
      myRankingInfo: myRaidRankData,
    };

    return data;
  }

  async getBossInfo() {
    const url: string = bossUrl;

    const bossRaidData = await firstValueFrom(
      this.httpService.get(url).pipe(map((response) => response.data)),
    );

    return bossRaidData;
  }
}
