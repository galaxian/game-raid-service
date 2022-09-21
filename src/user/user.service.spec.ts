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
});
