import { IsNotEmpty, IsNumber } from 'class-validator';

export class ResponseDto {
  @IsNotEmpty()
  @IsNumber()
  status: number;

  data?: any;
}
