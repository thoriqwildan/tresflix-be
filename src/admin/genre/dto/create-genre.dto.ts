import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateGenreDto {
  @IsString()
  @ApiProperty({ example: 'Action', description: 'Genre name', type: 'string' })
  genre: string;
}
