import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { RestaurantMenuDto, RestaurantOperatingHoursDto } from '.';

export class RestaurantDto {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsString()
  name: string;

  @IsNumber()
  cashBalance: number;

  @Type(() => RestaurantOperatingHoursDto)
  @IsArray()
  @ValidateNested({ each: true })
  operatingHours: RestaurantOperatingHoursDto[];

  @Type(() => RestaurantMenuDto)
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  menus: RestaurantMenuDto[];
}
