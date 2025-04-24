import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @ApiProperty({
    example: 'test@example.com',
    description: 'Input for user email',
    type: 'string',
  })
  email: string;

  @ApiProperty({
    example: 'password12345',
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
