import { IsNotEmpty } from 'class-validator';

export class EnterRaidDto {
  @IsNotEmpty()
  readonly userId: number;

  @IsNotEmpty()
  readonly level: number;
}
