import { ApiProperty } from '@nestjs/swagger';

export class PaginationResponseDto<T> {
  @ApiProperty()
  data: T;

  @ApiProperty({ description: 'Total data' })
  total: number;

  @ApiProperty({ description: 'Current Page' })
  page: number;

  @ApiProperty({ description: 'Items per Page' })
  limit: number;

  @ApiProperty({ description: 'Total Pages' })
  totalPages: number;
}
