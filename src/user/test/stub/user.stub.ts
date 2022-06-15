import { UserType } from '../../../common/types';

export const userStub = (): UserType => {
  return {
    id: 0,
    name: 'some-user',
    cashBalance: 40,
    __entity: 'RestaurantEntity',
  };
};
