import {
  BadRequestException,
  ForbiddenException,
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

const bossUrl = config.get('boss_url');

@Injectable()
export class RaidService {
  constructor(
    @InjectRepository(RaidRecord)
    private readonly raidRepository: Repository<RaidRecord>,
    private readonly userService: UserService,
    private readonly httpService: HttpService,
  ) {}

  async getRaidStatus() {
    const getRecord = await this.raidRepository.find({
      relations: ['user'],
      order: { endTime: 'DESC' },
    });

    if (getRecord.length === 0) {
      return { canEnter: true, enteredUserId: null };
    }

    const enterTime = getRecord[0].enterTime.getTime();
    const now = new Date().getTime();

    const duration: number = (await this.getBossInfo()).bossRaids[0]
      .bossRaidLimitSeconds;
    console.log(duration);

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

  async enterBossRaid(enterRaidDto: EnterRaidDto) {
    const { userId, level } = enterRaidDto;

    const findUser = await this.userService.findUserByfield({
      where: {
        id: userId,
      },
    });

    if (!findUser) {
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }

    const canEnter = (await this.getRaidStatus()).canEnter;

    if (!canEnter) {
      return {
        isEnter: false,
        raidRecordId: null,
      };
    }

    const record = this.raidRepository.create({
      level,
      user: findUser,
    });

    const saveRecord = await this.raidRepository.save(record);

    return {
      isEnter: true,
      raidRecordId: saveRecord.id,
    };
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

    raidRecord.endTime = new Date();

    await this.raidRepository.save(raidRecord);
  }

  async getBossInfo() {
    const url = bossUrl;

    const responseData = await firstValueFrom(
      this.httpService.get(url).pipe(map((response) => response.data)),
    );

    return responseData;
  }
}
