/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { CreateWatchListDto } from './create.dto';
import { Request } from 'express';
import { JwtRoleGuard } from 'src/auth/guards/jwtrole.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('watchlist')
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Post()
  @UseGuards(JwtRoleGuard)
  @ApiBearerAuth()
  async create(@Req() req: Request, @Body() watchlist: CreateWatchListDto) {
    const userId = req.user!['sub'];
    return await this.watchlistService.createWatchlist(userId, watchlist);
  }
}
