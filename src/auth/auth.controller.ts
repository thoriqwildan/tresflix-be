/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignUpDto } from './dto/auth-signup.dto';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { JwtRoleGuard } from './guards/jwtrole.guard';
import { ApiCookieAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async SignUp(
    @Body() signupDto: AuthSignUpDto,
  ) {
    const tokens = await this.authService.signUp(signupDto);

    return tokens;
  }

  @Post('signin')
  async SignIn(
    @Body() signInDto: LoginDto,
  ) {
    const tokens = await this.authService.signIn(signInDto);

    return tokens;
  }

  @Get('test')
  @UseGuards(JwtRoleGuard)
  @ApiCookieAuth()
  test(@Req() req: Request) {
    return req.user!['email'];
  }

  @Get('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiCookieAuth()
  async refreshToken(
    @Req() req: Request,
  ) {
    const tokens = await this.authService.refresh(req.user!['sub']);
    console.log(req.user!['sub']);
    if (!tokens) {
      throw new NotFoundException('Token not found');
    }
    return tokens;
  }

  @Get('me')
  @UseGuards(JwtRoleGuard)
  @ApiCookieAuth()
  async getMe(@Req() req: Request) {
    return await this.authService.getMe(req.user!['sub']);
  }

  @Delete('signout')
  @UseGuards(JwtRoleGuard)
  @ApiCookieAuth()
  async logout(@Req() req: Request) {
    await this.authService.signOut(req.user!['sub']);
    return { message: 'Logout success' };
  }
}
