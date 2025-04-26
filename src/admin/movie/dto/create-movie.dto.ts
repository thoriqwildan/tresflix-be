/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({ example: 'Habibie & Ainun' })
  title: string;

  @ApiProperty({ example: '2012', type: 'string' })
  release_year: string;

  @ApiPropertyOptional({ example: '109' })
  duration?: string;

  @ApiProperty({
    example: 'Film ini diangkat dari kisah nyata yaitu mai kisah',
  })
  description: string;

  @IsOptional()
  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  poster?: any;

  file?: string;

  @ApiPropertyOptional({ example: 'https://www.youtube.com/watch?v=example' })
  @IsOptional()
  trailer_url?: string;

  @ApiProperty({ example: ['Action', 'Slice of Life', 'Horror'] })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  genres: string[];

  @ApiProperty({ example: ['1', '2', '3', '4'] })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  actors: string[];
}
