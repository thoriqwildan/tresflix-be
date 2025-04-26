import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateRateDto } from './dto/create.dto';

@Injectable()
export class RateService {
  constructor(private prismaService: PrismaService) {}

  async createRate(userId: number, rate: CreateRateDto) {
    const movieExists = await this.prismaService.movie.findFirst({
      where: { id: Number(rate.movie_id), deleted_at: null },
    });
    if (!movieExists) {
      throw new BadRequestException('Movie not found');
    }

    const existingRate = await this.prismaService.rating.findFirst({
      where: { user_id: userId, movie_id: Number(rate.movie_id) },
    });
    if (rate.rate < 1 || rate.rate > 10) {
      throw new BadRequestException('Rate must be between 1 and 10');
    }
    if (existingRate) {
      return await this.prismaService.rating.update({
        where: { id: existingRate.id },
        data: { rating: Number(rate.rate) },
        select: {
          id: true,
          user_id: true,
          movie_id: true,
          rating: true,
        },
      });
    } else {
      return await this.prismaService.rating.create({
        data: {
          user_id: userId,
          movie_id: Number(rate.movie_id),
          rating: Number(rate.rate),
        },
        select: {
          id: true,
          user_id: true,
          movie_id: true,
          rating: true,
        },
      });
    }
  }
}
