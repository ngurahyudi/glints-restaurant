import { Test, TestingModule } from '@nestjs/testing';
import { OrderDto } from 'src/common/dto';
import { OrderController } from '../order.controller';
import { OrderService } from '../order.service';
import { orderStub } from './stub';

const createOrderDto: OrderDto = orderStub();

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

  describe('Methods: ', () => {
    describe('createOrder', () => {
      it('should be defined', () => {
        expect(orderController.createOrder).toBeDefined();
      });

      describe('when createOrder is called', () => {
        test(`then it should create user's order`, async () => {
          orderController.createOrder(createOrderDto);
          expect(orderController.createOrder(createOrderDto)).resolves.toEqual({
            message: 'dataSuccessfullySaved',
          });

          expect(orderService.createOrder).toHaveBeenCalledWith(createOrderDto);
        });
      });
    });
  });
});
