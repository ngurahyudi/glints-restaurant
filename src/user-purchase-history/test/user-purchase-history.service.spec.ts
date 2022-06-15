import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { UserPurchaseHistoryDto } from '../../common/dto';
import { UserPurchaseHistoryService } from '../user-purchase-history.service';
import { userPurchaseHistoryStub } from './stub/';

describe('UserPurchaseHistoryService', () => {
  let userPurchaseHistoryService: UserPurchaseHistoryService;

  const mockEntityManager = {
    query: jest.fn(),
    getCustomRepository: jest.fn(
      (fn) =>
        mockEntityManager[fn] ||
        (mockEntityManager[fn] = createMock<typeof fn>()),
    ),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue({
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      setLock: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockReturnThis(),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserPurchaseHistoryService],
    }).compile();

    userPurchaseHistoryService = module.get<UserPurchaseHistoryService>(
      UserPurchaseHistoryService,
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userPurchaseHistoryService).toBeDefined();
  });

  describe('Methods: ', () => {
    describe('create', () => {
      it('should be defined', () => {
        expect(userPurchaseHistoryService.create).toBeDefined();
      });
    });
  });

  describe('when updateBalance is called', () => {
    test(`then it should create user's purchase history data`, async () => {
      const params: UserPurchaseHistoryDto[] = [userPurchaseHistoryStub()];

      await userPurchaseHistoryService.create(params, mockEntityManager);

      expect(mockEntityManager.create).toHaveBeenCalledTimes(1);
      expect(mockEntityManager.save).toHaveBeenCalledTimes(1);
    });
  });
});
