import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from '../order.controller';
import { OrderService } from '../order.service';

describe('OrderController', () => {
  let orderController: OrderController;
  let orderService: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        OrderService,
        {
          provide: OrderService,
          useValue: {
            createOrder: jest
              .fn()
              .mockImplementation(() =>
                Promise.resolve({ message: 'dataSuccessfullySaved' }),
              ),
          },
        },
      ],
    }).compile();

    orderController = module.get<OrderController>(OrderController);
    orderService = module.get<OrderService>(OrderService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(orderController).toBeDefined();
  });

  describe('orderService', () => {
    it('should be defined', () => {
      expect(orderService).toBeDefined();
    });
  });
});
