import { IsNotEmpty } from 'class-validator';

export class RankDto {
  @IsNotEmpty()
  readonly userId: number;
}
