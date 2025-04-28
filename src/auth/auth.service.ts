import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthSignUpDto } from './dto/auth-signup.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async signUp(signupDto: AuthSignUpDto): Promise<LoginResponseDto> {
    const email = await this.prismaService.user.count({
      where: { email: signupDto.email },
    });
    if (email > 0) {
      throw new BadRequestException('Email already Exist!');
    }
    signupDto.password = await bcrypt.hash(signupDto.password, 10);

    const data = await this.prismaService.user.create({
      data: {
        email: signupDto.email,
        name: signupDto.name,
        password: signupDto.password,
      },
    });

    const payload = { sub: data.id, email: data.email, role: data.role };
    return await this.generateToken(payload);
  }

  async signIn(loginDto: LoginDto): Promise<LoginResponseDto> {
    const data = await this.prismaService.user.findUnique({
      where: { email: loginDto.email },
    });
    if (!data) {
      throw new BadRequestException('Invalid Email or Password!');
    }

    const passwordCheck = await bcrypt.compare(
      loginDto.password,
      data.password,
    );
    if (!passwordCheck) {
      throw new BadRequestException('Invalid Password');
    }

    const payload = { sub: data.id, email: data.email, role: data.role };
    const tokens = await this.generateToken(payload);
    if (loginDto.remember_me == false) {
      return { access_token: tokens.access_token };
    }
    return tokens;
  }

  async refresh(user_id: number) {
    const data = await this.prismaService.user.findFirst({
      where: { id: user_id },
    });
    if (!data) {
      throw new BadRequestException('Invalid user');
    }
    const payload = { sub: data.id, email: data.email, role: data.role };
    const token = await this.generateToken(payload);
    return token;
  }

  async signOut(user_id: number) {
    await this.prismaService.user.update({
      where: { id: user_id },
      data: { refresh_token: null },
    });
  }

  async getMe(user_id: number) {
    const data = await this.prismaService.user.findFirst({
      where: { id: user_id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
      },
    });
    if (!data) {
      throw new BadRequestException('Invalid user');
    }
    return data;
  }

  async generateToken(payload: {
    sub: number;
    email: string;
    role: string;
  }): Promise<LoginResponseDto> {
    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get('secret.access'),
      expiresIn: '30m',
    });
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get('secret.refresh'),
      expiresIn: '7d',
    });
    const hashedRefreshToken = await bcrypt.hash(refresh_token, 10);
    await this.prismaService.user.update({
      where: { id: payload.sub },
      data: { refresh_token: hashedRefreshToken },
    });
    return { access_token, refresh_token };
  }
}
