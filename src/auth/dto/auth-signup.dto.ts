import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class AuthSignUpDto {
  @IsEmail()
  @ApiProperty({ example: 'test@example.com' })
  email: string;

  @IsString()
  @ApiPropertyOptional({ example: 'John Doe' })
  name?: string;

  @IsString()
  @ApiProperty({ example: 'password12345' })
  password: string;
}
