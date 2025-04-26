import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString } from 'class-validator';

export class CreateWatchListDto {
  @IsNotEmpty()
  @ApiProperty({ example: '1' })
  @IsNumberString()
  movie_id: number;
}
