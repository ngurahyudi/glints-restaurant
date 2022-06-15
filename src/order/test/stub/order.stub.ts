import { OrderDto } from '../../../common/dto';

export const orderStub = (): OrderDto => {
  return {
    userId: 3,
    restaurantId: 6,
    menus: [
      {
        menuId: 1,
        amount: 2.5,
      },
      {
        menuId: 1,
        amount: 2.5,
      },
    ],
  };
};
