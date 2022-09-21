import { RedisModule } from '@nestjs-modules/ioredis';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { RaidRecord } from './entity/raid.entity';
import { RaidService } from './raid.service';

describe('RaidService', () => {
  let raidService: RaidService;

  const mockRaidRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockUserService = {};

  const mockHttpService = {};

  const mockCacheManager = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        RedisModule.forRoot({
          config: {
            host: 'localhost',
            port: 6389,
          },
        }),
      ],
      providers: [
        RaidService,
        {
          provide: getRepositoryToken(RaidRecord),
          useValue: mockRaidRepository,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    raidService = module.get<RaidService>(RaidService);
  });

  it('should be defined', () => {
    expect(raidService).toBeDefined();
  });
});
