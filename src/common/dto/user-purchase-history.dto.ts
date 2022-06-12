import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class UserPurchaseHistoryDto {
  @IsNumber()
  transactionAmount: number;

  @IsDateString()
  transactionDate?: Date;

  @IsNumber()
  @IsOptional()
  userId?: number;

  @IsNumber()
  @IsOptional()
  restaurantId?: number;

  @IsNumber()
  @IsNotEmpty()
  menuId: number;
}
