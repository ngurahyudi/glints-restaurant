import { Test, TestingModule } from '@nestjs/testing';
import { MoreLessEnum, OperatorEnum, SortEnum } from '../../common/enums';
import { RestaurantController } from '../restaurant.controller';
import { RestaurantService } from '../restaurant.service';
import { dishByPriceStub, restaurantStub, searchStub } from './stub';

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
            listByDateTime: jest
              .fn()
              .mockImplementation(() =>
                Promise.resolve([[restaurantStub()], 5]),
              ),
            listByPriceRange: jest
              .fn()
              .mockImplementation(() => Promise.resolve([dishByPriceStub()])),
            filterRestaurantsAndDishesByName: jest
              .fn()
              .mockImplementation(() => Promise.resolve([searchStub()])),
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

  describe('Methods: ', () => {
    describe('listByDateTime', () => {
      it('should be defined', () => {
        expect(restaurantController.listByDateTime).toBeDefined();
      });

      describe('when listByDateTime is called', () => {
        test('then it should list restaurant availability by date time', async () => {
          expect(
            restaurantController.listByDateTime(
              '2022-05-29T23:20:00',
              'name',
              OperatorEnum.CONTAINS,
              'mex',
              'name',
              SortEnum.ASC,
              0,
              10,
            ),
          ).resolves.toEqual([[restaurantStub()], 5]);

          expect(restaurantService.listByDateTime).toHaveBeenCalled();
        });
      });
    });

    describe('listByPriceRange', () => {
      it('should be defined', () => {
        expect(restaurantController.listByPriceRange).toBeDefined();
      });

      describe('when listByPriceRange is called', () => {
        test('then it should list restaurant by price range', async () => {
          expect(
            restaurantController.listByPriceRange(
              10,
              MoreLessEnum.MORE,
              3,
              12.0,
              15.0,
            ),
          ).resolves.toEqual([dishByPriceStub()]);

          expect(restaurantService.listByPriceRange).toHaveBeenCalled();
        });
      });
    });

    describe('filterRestaurantsAndDishesByName', () => {
      it('should be defined', () => {
        expect(
          restaurantController.filterRestaurantsAndDishesByName,
        ).toBeDefined();
      });

      describe('when filterRestaurantsAndDishesByName is called', () => {
        test('then it should list restaurant by price range', async () => {
          expect(
            restaurantController.filterRestaurantsAndDishesByName('choco'),
          ).resolves.toEqual([searchStub()]);

          expect(
            restaurantService.filterRestaurantsAndDishesByName,
          ).toHaveBeenCalled();
        });
      });
    });
  });
});
