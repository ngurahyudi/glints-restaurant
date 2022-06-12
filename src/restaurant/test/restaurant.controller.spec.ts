import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantController } from '../restaurant.controller';
import { RestaurantService } from '../restaurant.service';

describe('RestaurantController', () => {
  let restaurantController: RestaurantController;
  let restaurantService: RestaurantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantController],
      providers: [
        RestaurantService,
        {
          provide: RestaurantService,
          useValue: {
            updateBalance: jest
              .fn()
              .mockImplementation(() => Promise.resolve()),
          },
        },
      ],
    }).compile();

    restaurantController =
      module.get<RestaurantController>(RestaurantController);

    restaurantService = module.get<RestaurantService>(RestaurantService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(restaurantController).toBeDefined();
  });

  describe('restaurantService', () => {
    it('should be defined', () => {
      expect(restaurantService).toBeDefined();
    });
  });
});
