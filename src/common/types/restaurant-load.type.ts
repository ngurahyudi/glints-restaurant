import { RestaurantMenuLoadType } from '.';

export type RestaurantLoadType = {
  restaurantName: string;
  cashBalance: number;
  openingHours: string;
  menu: RestaurantMenuLoadType[];
};
