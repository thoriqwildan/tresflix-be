/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Body,
  Controller,
  Delete,
  Get,
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
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.signUp(signupDto);

    res.cookie('access_token', tokens.token, {
      httpOnly: true,
      maxAge: 30 * 60 * 1000,
    });

    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return { message: 'Logged In' };
  }

  @Post('signin')
  async SignIn(
    @Body() signInDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.signIn(signInDto);

    res.cookie('access_token', tokens.token, {
      httpOnly: true,
      maxAge: 30 * 60 * 1000,
    });

    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return { message: 'Logged In' };
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
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.refresh(req.user!['sub']);
    console.log(req.user!['sub']);
    if (!tokens) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.res?.clearCookie('access_token');
    req.res?.clearCookie('refresh_token');

    res.cookie('access_token', tokens.token, {
      httpOnly: true,
      maxAge: 30 * 60 * 1000,
    });

    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return { message: 'Logged In' };
  }

  @Delete('signout')
  @UseGuards(JwtRoleGuard)
  @ApiCookieAuth()
  async logout(@Req() req: Request) {
    req.res?.clearCookie('access_token');
    req.res?.clearCookie('refresh_token');
    await this.authService.signOut(req.user!['sub']);
    return { message: 'Logged Out' };
  }
}
