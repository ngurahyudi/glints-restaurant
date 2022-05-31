import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UserPurchaseHistoryDto } from './user-purchase-history.dto';

export class UserDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsNumber()
  cashBalance: number;

  @Type(() => UserPurchaseHistoryDto)
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  purchaseHistories: UserPurchaseHistoryDto[];
}
