import axios from 'axios';
import { Seeder } from 'typeorm-seeding';
import * as moment from 'moment';
import { RestaurantLoadType } from '../../common/types';
import {
  RestaurantDto,
  RestaurantMenuDto,
  RestaurantOperatingHoursDto,
} from '../../common/dto';
import { DaysEnum } from '../../common/enums/days.enum';
import { getRepository } from 'typeorm';
import { RestaurantEntity } from '../entities';
import { proper } from '../../common/helpers';

export default class RestaurantSeed implements Seeder {
  public async run(): Promise<void> {
    const restaurantRepository = getRepository(RestaurantEntity);
    const recordCount = await restaurantRepository.count();
    if (recordCount > 0) return;

    const request = await axios.get(
      'https://gist.githubusercontent.com/seahyc/b9ebbe264f8633a1bf167cc6a90d4b57/raw/021d2e0d2c56217bad524119d1c31419b2938505/restaurant_with_menu.json',
    );

    const data: RestaurantLoadType[] = request.data;

    const restaurants: RestaurantDto[] = [];

    for (const dt of data) {
      const menus: RestaurantMenuDto[] = [];

      /* --- Menu --- */
      for (const m of dt.menu) {
        const menu: RestaurantMenuDto = {
          name: proper(m.dishName),
          price: m.price,
        };

        menus.push(menu);
      }
      /* --- /Menu --- */

      /* --- Opening Hours --- */
      const openingHours: RestaurantOperatingHoursDto[] = [];

      const openDays = dt.openingHours.split('/');

      for (const openDay of openDays) {
        const openDayTrim = openDay.trim();

        const timeIndex = openDayTrim.indexOf(openDayTrim.match(/\d+/)[0]);
        const days = openDayTrim.substring(0, timeIndex).trim();
        const times = openDayTrim.substring(timeIndex).trim().split('-');

        const openTime = moment(times[0].trim(), 'h:m:s A').format('HH:mm:ss');
        const closeTime = moment(times[1].trim(), 'h:m:s A').format('HH:mm:ss');

        const daysCommas = days.split(',');
        for (const dayComma of daysCommas) {
          const daysDashes = dayComma.trim().split('-');
          if (daysDashes.length === 1) {
            const openingHour: RestaurantOperatingHoursDto = {
              day: this.getEnumDaysValue(daysDashes[0]),
              openTime: openTime,
              closeTime: closeTime,
            };

            openingHours.push(openingHour);
          } else {
            const dayFirst = this.getEnumDaysValue(daysDashes[0].trim());
            const dayLast = this.getEnumDaysValue(daysDashes[1].trim());
            for (let i = dayFirst; i <= dayLast; i++) {
              const openingHour: RestaurantOperatingHoursDto = {
                day: i,
                openTime: openTime,
                closeTime: closeTime,
              };

              openingHours.push(openingHour);
            }
          }
        }
      }
      /* --- /Opening Hours --- */

      const restaurant = new RestaurantDto();
      restaurant.name = proper(dt.restaurantName);
      restaurant.cashBalance = dt.cashBalance;
      restaurant.menus = menus;
      restaurant.operatingHours = openingHours.sort((a, b) => a.day - b.day);

      restaurants.push(restaurant);
    }

    await restaurantRepository.save(restaurantRepository.create(restaurants));
  }

  getEnumDaysValue(day: string): DaysEnum {
    switch (day.trim().toLowerCase()) {
      case 'mon':
        return DaysEnum.MONDAY;
      case 'tues':
        return DaysEnum.TUESDAY;
      case 'weds':
        return DaysEnum.WEDNESDAY;
      case 'thurs':
        return DaysEnum.THURSDAY;
      case 'fri':
        return DaysEnum.FRIDAY;
      case 'sat':
        return DaysEnum.SATURDAY;
      default:
        return DaysEnum.SUNDAY;
    }
  }
}
