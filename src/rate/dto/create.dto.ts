import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class CreateRateDto {
  @ApiProperty({ example: '1' })
  @IsNumberString()
  movie_id: number;

  @ApiProperty({ example: '1' })
  @IsNumberString()
  rate: number;
}
