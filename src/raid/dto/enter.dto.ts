import { IsNotEmpty } from 'class-validator';

export class EnterRaidDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  level: number;
}
