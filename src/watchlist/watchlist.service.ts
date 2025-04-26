/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateWatchListDto } from './create.dto';

@Injectable()
export class WatchlistService {
  constructor(private prismaService: PrismaService) {}

  async createWatchlist(userId: number, watchlist: CreateWatchListDto) {
    const movieExists = await this.prismaService.movie.findFirst({
      where: { id: Number(watchlist.movie_id), deleted_at: null },
    });
    if (!movieExists) {
      throw new BadRequestException('Movie not found');
    }
    const existingWatchlist = await this.prismaService.watchlist.findFirst({
      where: { user_id: userId, movie_id: Number(watchlist.movie_id) },
    });
    if (existingWatchlist) {
      return await this.prismaService.watchlist.delete({
        where: { id: existingWatchlist.id },
        select: {
          id: true,
          user_id: true,
          movie_id: true,
        },
      });
    } else {
      return await this.prismaService.watchlist.create({
        data: {
          user_id: userId,
          movie_id: Number(watchlist.movie_id),
        },
        select: {
          id: true,
          user_id: true,
          movie_id: true,
        },
      });
    }
  }
}
