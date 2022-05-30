import { RestaurantMenuType } from '.';

export type RestaurantType = {
  restaurantName: string;
  cashBalance: number;
  openingHours: string;
  menu: RestaurantMenuType[];
};
