import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUser(): Promise<{ userId: number }> {
    const createUser = this.userRepository.create();
    const saveUser = await this.userRepository.save(createUser);

    return { userId: saveUser.id };
  }

  async getUser(id: number) {
    const findUser: User = await this.userRepository.findOne({
      where: { id },
      relations: ['raidRecord'],
    });

    let totalScore = 0;

    const response = [];

    for (const record of findUser.raidRecord) {
      totalScore += record.score;
      response.push({
        raidRecordId: record.id,
        score: record.score,
        enterTime: record.enterTime,
        endTime: record.endTime,
      });
    }

    return {
      totalScore,
      bossRaidHistory: response,
    };
  }

  async findUserByfield(
    options: FindOneOptions<User>,
  ): Promise<User | undefined> {
    return await this.userRepository.findOne(options);
  }
}
