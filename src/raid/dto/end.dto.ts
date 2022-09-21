import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class EndRaidDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly userId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly raidRecordId: number;
}
