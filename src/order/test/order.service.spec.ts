import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';
import { RestaurantService } from '../../restaurant/restaurant.service';
import { UserPurchaseHistoryService } from '../../user-purchase-history/user-purchase-history.service';

import { OrderService } from '../order.service';

describe('OrderService', () => {
  let orderService: OrderService;
  let restaurantService: RestaurantService;
  let userService: UserService;
  let userPurchaseHistoryService: UserPurchaseHistoryService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        OrderService,
        RestaurantService,
        {
          provide: RestaurantService,
          useValue: {
            updateBalance: jest
              .fn()
              .mockImplementation(() => Promise.resolve()),
          },
        },
        UserService,
        UserPurchaseHistoryService,
        ConfigService,
      ],
    }).compile();

    orderService = module.get<OrderService>(OrderService);
    restaurantService = module.get<RestaurantService>(RestaurantService);
    userService = module.get<UserService>(UserService);
    userPurchaseHistoryService = module.get<UserPurchaseHistoryService>(
      UserPurchaseHistoryService,
    );
    configService = module.get<ConfigService>(ConfigService);
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
});
