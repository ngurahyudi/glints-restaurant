import { RestaurantType } from '../../../common/types';

export const restaurantStub = (): RestaurantType => {
  return {
    id: 0,
    name: 'some-restaurant-name',
    __entity: 'RestaurantEntity',
  };
};
