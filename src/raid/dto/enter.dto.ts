import { IsNotEmpty, IsNumber, IsPositive, Min } from 'class-validator';

export class EnterRaidDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly userId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly level: number;
}
