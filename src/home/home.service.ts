/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { HomeRepositories } from './repositories/home.repository';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class HomeService {
  constructor(
    private prismaService: PrismaService,
    private readonly homeRepositories: HomeRepositories,
  ) {}

  async getNewMovies(paginationDto: PaginationDto) {
    return await this.homeRepositories.findUpdatedMovieWithPagination(
      paginationDto,
    );
  }

  async getTopRatedMovies() {
    const movies = await this.prismaService.movie.findMany({
      where: { deleted_at: null },
      take: 10,
      orderBy: {
        ratings: {
          _count: 'desc',
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        poster_url: true,
        trailer_url: true,
        release_year: true,
        duration: true,
        genres: {
          select: { id: true, name: true },
        },
        actors: {
          select: { id: true, name: true },
        },
        ratings: {
          select: {
            rating: true,
          },
        },
      },
    });

    // Hitung rata-rata rating per movie
    const formattedMovies = movies.map((movie) => {
      const totalRating = movie.ratings.reduce(
        (acc, curr) => acc + curr.rating,
        0,
      );
      const avgRating =
        movie.ratings.length > 0 ? totalRating / movie.ratings.length : 0;

      return {
        ...movie,
        avgRating: parseFloat(avgRating.toFixed(2)), // Biar lebih rapi
      };
    });

    return formattedMovies;
  }
}
