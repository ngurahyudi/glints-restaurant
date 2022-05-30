import { IsNotEmpty, IsString } from 'class-validator';
import { DaysEnum } from '../enums/days.enum';

export class RestaurantOperatingHoursDto {
  @IsString()
  @IsNotEmpty()
  day: DaysEnum;

  @IsString()
  @IsNotEmpty()
  openTime: string;

  @IsString()
  @IsNotEmpty()
  closeTime: string;
}
