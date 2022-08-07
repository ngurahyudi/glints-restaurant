import { createMock } from '@golevelup/ts-jest';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateBalanceDto } from '../../common/dto';
import { UserService } from '../user.service';
import { userStub } from './stub/user.stub';

describe('UserService', () => {
  let userService: UserService;

  const mockEntityManager = {
    query: jest.fn(),
    getCustomRepository: jest.fn(
      (fn) =>
        mockEntityManager[fn] ||
        (mockEntityManager[fn] = createMock<typeof fn>()),
    ),
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
      providers: [UserService],
    }).compile();

    userService = module.get<UserService>(UserService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('Methods: ', () => {
    describe('updateBalance', () => {
      it('should be defined', () => {
        expect(userService.updateBalance).toBeDefined();
      });
    });

    describe('when updateBalance is called', () => {
      const params: UpdateBalanceDto = {
        id: 10,
        totalAmount: 100.0,
        entityManager: mockEntityManager,
      };

      test('then it should call createQueryBuilder', async () => {
        await userService.updateBalance(params);

        expect(params.entityManager.createQueryBuilder).toHaveBeenCalledTimes(
          1,
        );

        expect(
          params.entityManager.createQueryBuilder().setLock,
        ).toHaveBeenCalledTimes(1);

        expect(
          params.entityManager.createQueryBuilder().where,
        ).toHaveBeenCalledTimes(1);
      });

      test('then it should thrown exception when user data not found', async () => {
        jest
          .spyOn(params.entityManager.createQueryBuilder(), 'getOne')
          .mockResolvedValue(undefined);

        try {
          await userService.updateBalance(params);
        } catch (error) {
          expect(error).toBeInstanceOf(BadRequestException);
          expect(error.message).toBe('userNotFound');
        }
      });

      test('then it should thrown exception when user balance is insufficient', async () => {
        jest
          .spyOn(params.entityManager.createQueryBuilder(), 'getOne')
          .mockResolvedValue(userStub());

        try {
          await userService.updateBalance(params);
        } catch (error) {
          expect(error).toBeInstanceOf(BadRequestException);
          expect(error.message).toBe('insufficientBalance');
        }
      });

      test('then it should update user balance', async () => {
        jest
          .spyOn(params.entityManager.createQueryBuilder(), 'getOne')
          .mockResolvedValue('userStub()');

        await userService.updateBalance(params);

        expect(params.entityManager.update).toHaveBeenCalledTimes(1);
      });
    });
  });
});
