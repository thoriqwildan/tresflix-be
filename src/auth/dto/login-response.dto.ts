import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty()
  access_token?: string;

  @ApiProperty()
  refresh_token?: string;
}
