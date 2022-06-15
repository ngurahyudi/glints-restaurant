import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { EntityManager } from 'typeorm';
import { UserService } from '../../user/user.service';
import { RestaurantService } from '../../restaurant/restaurant.service';
import { UserPurchaseHistoryService } from '../../user-purchase-history/user-purchase-history.service';

import { OrderService } from '../order.service';
import { orderStub } from './stub/order.stub';
import { createMock } from '@golevelup/ts-jest';
import { getEntityManagerToken } from '@nestjs/typeorm';

type MockType<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [P in keyof T]?: jest.Mock<{}>;
};

describe('OrderService', () => {
  let orderService: OrderService;
  let restaurantService: RestaurantService;
  let userService: UserService;
  let userPurchaseHistoryService: UserPurchaseHistoryService;
  let configService: ConfigService;
  let mockManager: MockType<EntityManager>;

  const ENTITY_MANAGER_TOKEN = getEntityManagerToken();

  const mockEntityManager = {
    transaction: jest.fn(),
    save: jest.fn(),
    getCustomRepository: jest.fn(
      (fn) =>
        mockEntityManager[fn] ||
        (mockEntityManager[fn] = createMock<typeof fn>()),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        OrderService,
        // RestaurantService,
        {
          provide: RestaurantService,
          useValue: {
            updateBalance: jest
              .fn()
              .mockImplementation(() => Promise.resolve()),
          },
        },
        UserService,
        {
          provide: UserService,
          useValue: {
            updateBalance: jest
              .fn()
              .mockImplementation(() => Promise.resolve()),
          },
        },
        UserPurchaseHistoryService,
        {
          provide: UserPurchaseHistoryService,
          useValue: {
            create: jest.fn().mockImplementation(() => Promise.resolve()),
          },
        },
        ConfigService,
        {
          provide: ENTITY_MANAGER_TOKEN,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    orderService = module.get<OrderService>(OrderService);

    restaurantService = module.get<RestaurantService>(RestaurantService);

    userService = module.get<UserService>(UserService);

    userPurchaseHistoryService = module.get<UserPurchaseHistoryService>(
      UserPurchaseHistoryService,
    );

    configService = module.get<ConfigService>(ConfigService);

    mockManager = module.get(EntityManager);
  });

  it('should be defined', () => {
    expect(orderService).toBeDefined();
  });

  describe('RestaurantService', () => {
    it('should be defined', () => {
      expect(restaurantService).toBeDefined();
    });
  });

  describe('UserService', () => {
    it('should be defined', () => {
      expect(userService).toBeDefined();
    });
  });

  describe('UserPurchaseHistoryService', () => {
    it('should be defined', () => {
      expect(userPurchaseHistoryService).toBeDefined();
    });
  });

  describe('ConfigService', () => {
    it('should be defined', () => {
      expect(configService).toBeDefined();
    });
  });

  describe('Methods: ', () => {
    describe('createOrder', () => {
      it('should be defined', () => {
        expect(orderService.createOrder).toBeDefined();
      });

      describe('when createOrder is called', () => {
        test('should call a transaction correctly', async () => {
          const spyTransaction = (
            mockManager.transaction as jest.Mock
          ).mockImplementation((cb) => cb(mockEntityManager));

          await orderService.createOrder(orderStub());
          expect(spyTransaction).toHaveBeenCalled();
        });

        test(`should update restaurant's balance`, async () => {
          // const spyTransaction = (
          //   mockManager.transaction as jest.Mock
          // ).mockImplementation((cb) => cb(mockEntityManager));

          await orderService.createOrder(orderStub());
          expect(restaurantService.updateBalance).toHaveBeenCalled();
        });

        test(`should update user's balance`, async () => {
          // const spyTransaction = (
          //   mockManager.transaction as jest.Mock
          // ).mockImplementation((cb) => cb(mockEntityManager));

          await orderService.createOrder(orderStub());
          expect(userService.updateBalance).toHaveBeenCalled();
        });
      });
    });
  });
});
