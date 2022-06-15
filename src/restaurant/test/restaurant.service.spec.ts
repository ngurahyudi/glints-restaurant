import { Test, TestingModule } from '@nestjs/testing';
import { getEntityManagerToken, getRepositoryToken } from '@nestjs/typeorm';
import {
  RestaurantEntity,
  RestaurantMenuEntity,
} from '../../database/entities';
import { EntityManager, Repository } from 'typeorm';
import { MoreLessEnum, OperatorEnum, SortEnum } from '../../common/enums';
import {
  DishesByPriceType,
  RestaurantType,
  SearchType,
} from '../../common/types';
import { RestaurantService } from '../restaurant.service';
import { dishByPriceStub, restaurantStub, searchStub } from './stub';
import { UnprocessableEntityException } from '@nestjs/common';
import { IDataTable } from '../../common/interfaces';
import { createMock } from '@golevelup/ts-jest';
import {
  ListRestaurantByDateTimeDto,
  UpdateBalanceDto,
} from '../../common/dto';

type MockType<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [P in keyof T]?: jest.Mock<{}>;
};

describe('RestaurantService', () => {
  let restaurantService: RestaurantService;

  let restaurantRepository: Repository<RestaurantEntity>;
  let restaurantMenuRepository: Repository<RestaurantMenuEntity>;
  let mockManager: MockType<EntityManager>;

  const RESTAURANT_REPOSITORY_TOKEN = getRepositoryToken(RestaurantEntity);
  const RESTAURANT_MENU_REPOSITORY_TOKEN =
    getRepositoryToken(RestaurantMenuEntity);
  const ENTITY_MANAGER_TOKEN = getEntityManagerToken();

  const mockRepository = {
    create: () => jest.fn(),
    save: async () => jest.fn(),
    dispose: async () => jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue({
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      innerJoin: jest.fn().mockReturnThis(),
      leftJoin: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      addGroupBy: jest.fn().mockReturnThis(),
      having: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      getQuery: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockReturnValue([[restaurantStub()], 5]),
      getRawMany: jest.fn().mockReturnValue([dishByPriceStub()]),
    }),
  };

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
      providers: [
        RestaurantService,
        {
          provide: RESTAURANT_REPOSITORY_TOKEN,
          useValue: mockRepository,
        },
        {
          provide: RESTAURANT_MENU_REPOSITORY_TOKEN,
          useValue: mockRepository,
        },
        {
          provide: ENTITY_MANAGER_TOKEN,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    restaurantService = module.get<RestaurantService>(RestaurantService);

    restaurantRepository = module.get<Repository<RestaurantEntity>>(
      RESTAURANT_REPOSITORY_TOKEN,
    );

    restaurantMenuRepository = module.get<Repository<RestaurantMenuEntity>>(
      RESTAURANT_MENU_REPOSITORY_TOKEN,
    );

    mockManager = module.get(ENTITY_MANAGER_TOKEN);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(restaurantService).toBeDefined();
  });

  describe('RestaurantRepository', () => {
    it('should be defined', () => {
      expect(restaurantRepository).toBeDefined();
    });
  });

  describe('RestaurantMenuRepository', () => {
    it('should be defined', () => {
      expect(restaurantMenuRepository).toBeDefined();
    });
  });

  describe('Methods: ', () => {
    describe('listByDateTime', () => {
      it('should be defined', () => {
        expect(restaurantService.listByDateTime).toBeDefined();
      });

      describe('when listByDateTime is called', () => {
        const validDate = '2022-05-29T23:20:00';
        const invalidDate = '2022-29-29T23:20:00';

        const dataTableParams: IDataTable = {
          filterBy: 'name',
          filterValue: 'mex',
          filterOperator: OperatorEnum.CONTAINS,
          sortBy: 'name',
          sortOrder: SortEnum.ASC,
          pageIndex: 0,
          pageSize: 10,
        };

        let qryParams: ListRestaurantByDateTimeDto = {
          dateTime: validDate,
          dataTableOptions: dataTableParams,
        };

        let result: [RestaurantType[], number];

        beforeEach(async () => {
          result = await restaurantService.listByDateTime(qryParams);
        });

        test('then it should call createQueryBuilder', async () => {
          expect(restaurantRepository.createQueryBuilder).toHaveBeenCalledTimes(
            1,
          );

          expect(
            restaurantRepository.createQueryBuilder().innerJoin,
          ).toHaveBeenCalledTimes(1);

          expect(
            restaurantRepository.createQueryBuilder().where,
          ).toHaveBeenCalledTimes(1);

          expect(
            restaurantRepository.createQueryBuilder().andWhere,
          ).toHaveBeenCalledTimes(3);

          expect(
            restaurantRepository.createQueryBuilder().skip,
          ).toHaveBeenCalledTimes(1);

          expect(
            restaurantRepository.createQueryBuilder().take,
          ).toHaveBeenCalledTimes(1);

          expect(
            restaurantRepository.createQueryBuilder().orderBy,
          ).toHaveBeenCalledTimes(1);

          expect(
            restaurantRepository.createQueryBuilder().select,
          ).toHaveBeenCalledTimes(1);
        });

        test('then it should list restaurant availability by date time', async () => {
          expect(
            restaurantRepository.createQueryBuilder().getManyAndCount,
          ).toHaveBeenCalled();

          expect(result).toEqual([[restaurantStub()], 5]);
        });

        test('then it should throw an exception when invalid date time is given as parameter', async () => {
          qryParams = {
            dateTime: invalidDate,
            ...qryParams,
          };

          try {
            await restaurantService.listByDateTime(qryParams);
          } catch (error) {
            expect(error).toBeInstanceOf(UnprocessableEntityException);
            expect(error.message).toBe('invalidDateTime');
          }
        });
      });
    });

    describe('listByPriceRange', () => {
      it('should be defined', () => {
        expect(restaurantService.listByPriceRange).toBeDefined();
      });

      describe('when listByPriceRange is called', () => {
        const params = {
          show: 10,
          operator: MoreLessEnum.MORE,
          totalDishesWithinPriceRange: 3,
          priceStarts: 12.0,
          priceEnds: 15.0,
        };

        let result: DishesByPriceType[];

        beforeEach(async () => {
          result = await restaurantService.listByPriceRange(
            params.show,
            params.operator,
            params.totalDishesWithinPriceRange,
            params.priceStarts,
            params.priceEnds,
          );
        });

        test('then it should call createQueryBuilder', async () => {
          expect(restaurantRepository.createQueryBuilder).toHaveBeenCalledTimes(
            1,
          );

          expect(
            restaurantRepository.createQueryBuilder().leftJoin,
          ).toHaveBeenCalledTimes(1);

          expect(
            restaurantRepository.createQueryBuilder().where,
          ).toHaveBeenCalledTimes(1);

          expect(
            restaurantRepository.createQueryBuilder().groupBy,
          ).toHaveBeenCalledTimes(1);

          expect(
            restaurantRepository.createQueryBuilder().addGroupBy,
          ).toHaveBeenCalledTimes(1);

          expect(
            restaurantRepository.createQueryBuilder().having,
          ).toHaveBeenCalledTimes(1);

          expect(
            restaurantRepository.createQueryBuilder().orderBy,
          ).toHaveBeenCalledTimes(1);

          expect(
            restaurantRepository.createQueryBuilder().limit,
          ).toHaveBeenCalledTimes(1);

          expect(
            restaurantRepository.createQueryBuilder().select,
          ).toHaveBeenCalledTimes(1);

          expect(
            restaurantRepository.createQueryBuilder().addSelect,
          ).toHaveBeenCalledTimes(2);
        });

        test('then it should list restaurant by price range', async () => {
          expect(
            restaurantRepository.createQueryBuilder().getRawMany,
          ).toHaveBeenCalled();

          expect(result).toEqual([dishByPriceStub()]);
        });
      });
    });

    describe('updateBalance', () => {
      it('should be defined', () => {
        expect(restaurantService.updateBalance).toBeDefined();
      });

      describe('when updateBalance is called', () => {
        const params: UpdateBalanceDto = {
          id: 10,
          totalAmount: 100.0,
          entityManager: mockEntityManager,
        };

        test('then it should call createQueryBuilder', async () => {
          await restaurantService.updateBalance(params);

          expect(params.entityManager.createQueryBuilder).toHaveBeenCalledTimes(
            1,
          );

          expect(
            params.entityManager.createQueryBuilder().addSelect,
          ).toHaveBeenCalledTimes(1);

          expect(
            params.entityManager.createQueryBuilder().setLock,
          ).toHaveBeenCalledTimes(1);

          expect(
            params.entityManager.createQueryBuilder().where,
          ).toHaveBeenCalledTimes(1);
        });

        test('then it should thrown exception when restaurant data not found', async () => {
          jest
            .spyOn(params.entityManager.createQueryBuilder(), 'getOne')
            .mockResolvedValue(undefined);

          try {
            await restaurantService.updateBalance(params);
          } catch (error) {
            expect(error).toBeInstanceOf(UnprocessableEntityException);
            expect(error.message).toBe('restaurantNotFound');
          }
        });

        test('then it should update restaurant balance', async () => {
          jest
            .spyOn(params.entityManager.createQueryBuilder(), 'getOne')
            .mockResolvedValue(restaurantStub());

          await restaurantService.updateBalance(params);

          expect(params.entityManager.update).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe('filterRestaurantsAndDishesByName', () => {
      describe('when filterRestaurantsAndDishesByName is called', () => {
        let result: SearchType[];

        beforeEach(async () => {
          jest.spyOn(mockManager, 'query').mockReturnValue([searchStub()]);

          result = await restaurantService.filterRestaurantsAndDishesByName(
            'some-keyword',
          );
        });

        test('it should create createQueryBuilder of restaurantRepository', () => {
          expect(restaurantRepository.createQueryBuilder).toHaveBeenCalledTimes(
            2,
          );
        });

        test('it should create createQueryBuilder of restaurantMenuRepository', () => {
          expect(
            restaurantMenuRepository.createQueryBuilder,
          ).toHaveBeenCalledTimes(2);
        });

        test('then it should list of restaurants/dishes by keyword', async () => {
          expect(mockManager.query).toHaveBeenCalled();
          expect(result).toEqual([searchStub()]);
        });
      });
    });
  });
});
