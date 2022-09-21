import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class RankDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly userId: number;
}
