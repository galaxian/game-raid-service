import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RaidStatusResponseDto } from 'src/raid/dto/raidStatusRes.dto';
import { FindOneOptions, Repository } from 'typeorm';
import { UserResponseDto } from './dto/userResponse.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUser(): Promise<{
    userId: number;
  }> {
    const createUser: User = this.userRepository.create();
    const saveUser: User = await this.userRepository.save(createUser);

    const data = { userId: saveUser.id };

    return data;
  }

  async getUser(id: number): Promise<UserResponseDto> {
    const findUser: User = await this.userRepository.findOne({
      where: { id },
      relations: ['raidRecord'],
    });

    if (!findUser) {
      throw new NotFoundException('존재하지 않는 사용자 입니다.');
    }

    let totalScore = 0;

    const bossRaidHistory: RaidStatusResponseDto[] = [];

    for (const record of findUser.raidRecord) {
      totalScore += record.score;
      bossRaidHistory.push({
        raidRecordId: record.id,
        score: record.score,
        enterTime:
          record.enterTime.toISOString().substring(0, 10) +
          ' ' +
          record.enterTime.toISOString().substring(11, 19),
        endTime:
          record.endTime.toISOString().substring(0, 10) +
          ' ' +
          record.endTime.toISOString().substring(11, 19),
      });
    }

    const data: UserResponseDto = {
      totalScore,
      bossRaidHistory,
    };

    return data;
  }

  async findUserByfieldAndNotFoundValid(
    options: FindOneOptions<User>,
  ): Promise<User | undefined> {
    const findUser = await this.userRepository.findOne(options);

    if (!findUser) {
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }

    return findUser;
  }
}
