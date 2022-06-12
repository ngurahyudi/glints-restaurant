import { DishesByPriceType } from '../../../common/types';

export const dishByPriceStub = (): DishesByPriceType => {
  return {
    id: 0,
    name: 'some-restaurant-name',
    totalDishes: 7,
  };
};
