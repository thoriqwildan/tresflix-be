import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class CreateActorDto {
  @ApiProperty({
    example: 'Reza Rahardian',
    description: 'Actor name',
    type: 'string',
  })
  name: string;

  @ApiProperty({ type: 'string', example: '1987-03-05' })
  @IsDateString()
  birthDate: string;

  @ApiProperty({ example: 'Actor biography', type: 'string' })
  biography: string;

  file?: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  picture?: any;
}
