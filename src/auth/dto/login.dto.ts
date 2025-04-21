/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsStrongPassword } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @ApiProperty({
    example: 'test@example.com',
    description: 'Input for user email',
    type: 'string',
  })
  email: string;

  @IsStrongPassword()
  @ApiProperty({
    example: 'StrongP@ssw0rd',
    description: 'Input for user password',
    type: 'string',
  })
  password: string;

  @IsBoolean()
  @ApiProperty({
    example: true,
    description: 'Input for remember me',
    type: 'boolean',
  })
  remember_me: boolean;
}
