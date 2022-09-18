import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
}
