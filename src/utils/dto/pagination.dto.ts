/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({ description: 'Page now', default: 1 })
  @Transform(({ value }) => Number(value) || 1)
  @IsNumber()
  @Min(1)
  page: number = 1;

  @ApiProperty({ description: 'Items per Page', default: 10 })
  @Transform(({ value }) => Number(value) || 5)
  @IsNumber()
  @Min(1)
  limit: number = 10;
}
