import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RaidStatusResponseDto } from 'src/raid/dto/raidStatusRes.dto';
import { ResponseDto } from 'src/utils/dto/response.dto';
import { FindOneOptions, Repository } from 'typeorm';
import { UserResponseDto } from './dto/userResponse.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUser(): Promise<ResponseDto> {
    const createUser: User = this.userRepository.create();
    const saveUser: User = await this.userRepository.save(createUser);

    const response: ResponseDto = {
      status: 201,
      data: {
        userId: saveUser.id,
      },
    };
    return response;
  }

  async getUser(id: number): Promise<ResponseDto> {
    const findUser: User = await this.userRepository.findOne({
      where: { id },
      relations: ['raidRecord'],
    });

    let totalScore = 0;

    const bossRaidHistory: RaidStatusResponseDto[] = [];

    for (const record of findUser.raidRecord) {
      totalScore += record.score;
      bossRaidHistory.push({
        raidRecordId: record.id,
        score: record.score,
        enterTime: record.enterTime,
        endTime: record.endTime,
      });
    }

    const data: UserResponseDto = {
      totalScore,
      bossRaidHistory,
    };

    const response: ResponseDto = { status: 200, data };

    return response;
  }

  async findUserByfield(
    options: FindOneOptions<User>,
  ): Promise<User | undefined> {
    return await this.userRepository.findOne(options);
  }
}
