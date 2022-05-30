import { IsNumber, IsString } from 'class-validator';

export class RestaurantMenuDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;
}
