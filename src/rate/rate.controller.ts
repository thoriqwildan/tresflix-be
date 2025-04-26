/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { RateService } from './rate.service';
import { Request } from 'express';
import { CreateRateDto } from './dto/create.dto';
import { JwtRoleGuard } from 'src/auth/guards/jwtrole.guard';
import { ApiCookieAuth } from '@nestjs/swagger';

@Controller('rate')
export class RateController {
  constructor(private readonly rateService: RateService) {}

  @Post()
  @UseGuards(JwtRoleGuard)
  @ApiCookieAuth()
  async create(@Req() req: Request, @Body() rate: CreateRateDto) {
    const userId = req.user!['sub'];
    return await this.rateService.createRate(userId, rate);
  }
}
