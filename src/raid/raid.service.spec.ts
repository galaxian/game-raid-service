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
    createQueryBuilder: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockUserService = {};

  const mockHttpService = {};

  const mockCacheManager = {
    get: jest.fn(),
  };

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

  describe('getRaidStatus', () => {
    it('레이드 상태 조회 대기열 없는 경우 입장 가능', async () => {
      //given
      mockRaidRepository.createQueryBuilder.mockImplementation(() => ({
        innerJoinAndSelect() {
          return this;
        },
        orderBy() {
          return this;
        },
        getOne() {
          return raidRecord;
        },
      }));

      const raidRecord: RaidRecord = {
        id: 1,
        score: 20,
        level: 2,
        enterTime: undefined,
        endTime: undefined,
        deleteAt: undefined,
        user: undefined,
      };

      mockCacheManager.get.mockImplementation(() => null);

      //when
      const result = await raidService.getRaidStatus();

      //then
      expect(result.canEnter).toEqual(true);
      expect(result.enteredUserId).toEqual(undefined);
    });
  });
});
