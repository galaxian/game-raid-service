import {
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
  ) {
    this.staticDataCaching();
  }

  async getRaidStatus(): Promise<RaidStatusEnterResponseDto> {
    const getRecord: RaidRecord = await this.raidRepository
      .createQueryBuilder('raidrecord')
      .innerJoinAndSelect('raidrecord.user', 'user')
      .orderBy('enterTime', 'DESC')
      .getOne();

    if (!getRecord) {
      const result: RaidStatusEnterResponseDto = {
        canEnter: true,
      };
      return result;
    }

    const enterInfo = await this.getRaidStatusFromCache();

    if (enterInfo) {
      const enterUserId: number = enterInfo['enterUserId'];
      const raidEnterTime: Date = enterInfo['raidEnterTime'];

      const enterTime = raidEnterTime.getTime();
      const now = new Date().getTime();

      const duration: number = await this.cacheManager.get(
        'bossRaidLimitSeconds',
      );
      const raidTime = now - enterTime;

      if (raidTime < duration * 1000) {
        const result: RaidStatusEnterResponseDto = {
          canEnter: false,
          enteredUserId: enterUserId,
        };
        return result;
      }
    }

    const result: RaidStatusEnterResponseDto = {
      canEnter: true,
    };

    return result;
  }

  async enterBossRaid(enterRaidDto: EnterRaidDto): Promise<EnterResponseDto> {
    const { userId, level } = enterRaidDto;

    const findUser: User =
      await this.userService.findUserByfieldAndNotFoundValid({
        where: {
          id: userId,
        },
      });

    const canEnter: boolean = (await this.getRaidStatus()).canEnter;

    if (!canEnter) {
      const data: EnterResponseDto = { isEntered: false };
      return data;
    }

    const record: RaidRecord = this.raidRepository.create({
      level,
      user: findUser,
    });

    const saveRecord: RaidRecord = await this.raidRepository.save(record);
    const enterTime = saveRecord.enterTime;

    await this.setRaidStatusToCache(userId, enterTime);

    const data: EnterResponseDto = {
      isEntered: true,
      raidRecordId: saveRecord.id,
    };

    return data;
  }

  async endBossRaid(endRaidDto: EndRaidDto): Promise<void> {
    const { userId, raidRecordId } = endRaidDto;

    await this.userService.findUserByfieldAndNotFoundValid({
      where: { id: userId },
    });

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

    const bossRadiDuration: number = await this.cacheManager.get(
      'bossRaidLimitSeconds',
    );
    const bossRaidScore: number = await this.cacheManager.get(
      'level_' + raidRecord.level,
    );

    const playerRaidTime: number =
      raidRecord.endTime.getTime() - raidRecord.enterTime.getTime();

    if (playerRaidTime < bossRadiDuration * 1000) {
      raidRecord.score = bossRaidScore;
    }

    await this.raidRepository.save(raidRecord);

    await this.updateRanking(bossRaidScore, userId);

    await this.dropRaidStatusFromCache();
  }

  async getRankList(rankDto: RankDto): Promise<{
    topRankerInfoList: RaidRankResponseDto[];
    myRankingInfo: RaidRankResponseDto;
  }> {
    const { userId } = rankDto;

    await this.userService.findUserByfieldAndNotFoundValid({
      where: { id: userId },
    });

    const rankerList = await this.getRankerListFromRedis();

    let myRank = 0;
    let myTotalScore = 0;

    for (const rank of rankerList) {
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
      topRankerInfoList: rankerList,
      myRankingInfo: myRaidRankData,
    };

    return data;
  }

  async updateRanking(score: number, userId: number) {
    await this.redis.zincrby('raidRank', score, userId);
  }

  async getRaidStatusFromCache() {
    return await this.cacheManager.get('enterInfo');
  }

  async dropRaidStatusFromCache() {
    await this.cacheManager.del('enterInfo');
  }

  async setRaidStatusToCache(userId: number, enterTime: Date) {
    await this.cacheManager.set(
      'enterInfo',
      { enterUserId: userId, raidEnterTime: enterTime },
      { ttl: 180 },
    );
  }

  async getRankerListFromRedis() {
    const rankList = await this.redis.zrevrange('raidRank', 0, -1);

    const results: RaidRankResponseDto[] = await Promise.all(
      rankList.map(async (element) => {
        const score = await this.redis.zscore('raidRank', element);
        const sameScoreList = await this.redis.zrevrangebyscore(
          'raidRank',
          score,
          score,
        );
        const rankIdx = sameScoreList[0];
        const rank = await this.redis.zrevrank('raidRank', rankIdx);
        const result: RaidRankResponseDto = {
          ranking: rank + 1,
          userId: Number(element),
          totalScore: Number(score),
        };
        return result;
      }),
    );
    return results;
  }

  async staticDataCaching() {
    const staticData = await firstValueFrom(
      this.httpService.get(bossUrl).pipe(map((response) => response.data)),
    );
    const bossRaid = staticData.bossRaids[0];

    await this.cacheManager.set(
      'bossRaidLimitSeconds',
      bossRaid.bossRaidLimitSeconds,
      { ttl: 0 },
    );
    await this.cacheManager.set('level_1', bossRaid.levels[0].score, {
      ttl: 0,
    });
    await this.cacheManager.set('level_2', bossRaid.levels[1].score, {
      ttl: 0,
    });
    await this.cacheManager.set('level_3', bossRaid.levels[2].score, {
      ttl: 0,
    });
  }
}
