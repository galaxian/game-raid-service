import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RaidRecord } from 'src/raid/entity/raid.entity';
import { User } from './entity/user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('createUser', () => {
    it('사용자 생성 후 user pk.', async () => {
      //given
      mockUserRepository.create.mockImplementation(() => ({
        id: undefined,
        createDate: undefined,
        updateDate: undefined,
        deleteAt: undefined,
        raidRecord: undefined,
      }));
      mockUserRepository.save.mockImplementation(() =>
        Promise.resolve({
          id: 1,
        }),
      );

      //when
      const result = await userService.createUser();

      //then
      expect(result.userId).toEqual(1);
    });
  });

  describe('getUser', () => {
    it('사용자 레이드 정보 조회 성공', async () => {
      //given
      const records: RaidRecord[] = [
        {
          id: 1,
          score: 10,
          level: 1,
          enterTime: undefined,
          endTime: undefined,
          user: undefined,
          deleteAt: undefined,
        },
        {
          id: 2,
          score: 20,
          level: 2,
          enterTime: undefined,
          endTime: undefined,
          user: undefined,
          deleteAt: undefined,
        },
        {
          id: 3,
          score: 30,
          level: 3,
          enterTime: undefined,
          endTime: undefined,
          user: undefined,
          deleteAt: undefined,
        },
      ];

      mockUserRepository.findOne.mockImplementation(() =>
        Promise.resolve({
          raidRecord: records,
          id: 1,
          createAt: undefined,
          updateAt: undefined,
          deleteAt: undefined,
        }),
      );

      //when
      const id = 1;
      let expectedTotalScore = 0;
      for (const element of records) {
        expectedTotalScore += element.score;
      }
      const result = await userService.getUser(id);

      //then
      expect(result.totalScore).toEqual(expectedTotalScore);
      expect(result.bossRaidHistory[0].raidRecordId).toEqual(records[0].id);
      expect(result.bossRaidHistory[0].score).toEqual(records[0].score);
    });
    it('존재하지 않는 사용자 정보 조회 실패', async () => {
      //given
      mockUserRepository.findOne.mockImplementation(() => null);

      //when
      const id = 1;
      const result = async () => {
        await userService.getUser(id);
      };

      //then
      expect(result).rejects.toThrowError(
        new NotFoundException('존재하지 않는 사용자 입니다.'),
      );
    });
  });
});
