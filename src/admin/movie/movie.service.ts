/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PrismaService } from 'src/database/prisma.service';
import { MovieRepositories } from './repositories/movie.repository';
import { PaginationDto } from 'src/utils/dto/pagination.dto';

@Injectable()
export class MovieService {
  constructor(
    private readonly prismaService: PrismaService,
    private movieRepository: MovieRepositories,
  ) {}

  async create(createMovieDto: CreateMovieDto) {
    const movies = await this.prismaService.movie.count({
      where: { title: createMovieDto.title, deleted_at: null },
    });
    if (movies > 0) {
      throw new BadRequestException('Movie already exists');
    }

    // 🔥 Validasi actors terlebih dahulu
    const existingActors = await this.prismaService.actor.findMany({
      where: {
        id: {
          in: createMovieDto.actors.map((actor) => +actor), // pastikan number
        },
      },
      select: { id: true },
    });

    // 🔥 Ambil id actor yang valid aja
    const validActorIds = existingActors.map((actor) => actor.id);

    const data = await this.prismaService.movie.create({
      data: {
        title: createMovieDto.title,
        release_year: +createMovieDto.release_year,
        duration: createMovieDto.duration!,
        description: createMovieDto.description,
        poster_url: createMovieDto.file!,
        trailer_url: createMovieDto.trailer_url,
        genres: {
          connectOrCreate: createMovieDto.genres.map((genre) => ({
            where: { name: genre },
            create: { name: genre },
          })),
        },
        actors: {
          connect: validActorIds.map((id) => ({ id })), // pakai id yang beneran ada
        },
      },
      select: {
        id: true,
        title: true,
        release_year: true,
        duration: true,
        description: true,
        poster_url: true,
        trailer_url: true,
        genres: {
          select: { id: true, name: true },
        },
        actors: {
          select: { id: true, name: true },
        },
      },
    });

    return data;
  }

  async findAll(paginationDto: PaginationDto) {
    return await this.movieRepository.findManyWithPagination(paginationDto);
  }

  async findOne(id: number) {
    const checkMovie = await this.prismaService.movie.findFirst({
      where: { id, deleted_at: null },
      select: {
        id: true,
        title: true,
        description: true,
        duration: true,
        release_year: true,
        trailer_url: true,
        poster_url: true,
        actors: {
          select: { id: true, name: true },
        },
        genres: {
          select: { id: true, name: true },
        },
      }
    });
    if (!checkMovie) {
      throw new BadRequestException('Movie not found');
    }
    return checkMovie;
  }

  async update(id: number, updateMovieDto: UpdateMovieDto) {
    const movie = await this.prismaService.movie.findFirst({
      where: { id, deleted_at: null },
    });
    if (!movie) {
      throw new BadRequestException('Movie not found');
    }

    const updateData: any = {};

    if (updateMovieDto.title !== undefined) {
      updateData.title = updateMovieDto.title;
    }
    if (updateMovieDto.release_year !== undefined) {
      updateData.release_year = +updateMovieDto.release_year;
    }
    if (updateMovieDto.duration !== undefined) {
      updateData.duration = updateMovieDto.duration;
    }
    if (updateMovieDto.description !== undefined) {
      updateData.description = updateMovieDto.description;
    }
    if (updateMovieDto.trailer_url !== undefined) {
      updateData.trailer_url = updateMovieDto.trailer_url;
    }
    if (updateMovieDto.file !== undefined) {
      updateData.poster_url = updateMovieDto.file;
    }
    if (updateMovieDto.genres !== undefined) {
      updateData.genres = {
        set: [],
        connectOrCreate: updateMovieDto.genres.map((genre) => ({
          where: { name: genre },
          create: { name: genre },
        })),
      };
    }
    if (updateMovieDto.actors !== undefined) {
      updateData.actors = {
        set: [],
        connect: updateMovieDto.actors.map((actor) => ({
          id: +actor,
        })),
      };
    }
    const data = await this.prismaService.movie.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        title: true,
        release_year: true,
        duration: true,
        description: true,
        poster_url: true,
        trailer_url: true,
        genres: {
          select: { id: true, name: true },
        },
        actors: {
          select: { id: true, name: true },
        },
      },
    });
    return data;
  }

  async updateMoviePicture(id: number, updateMovieDto: UpdateMovieDto) {
    return await this.prismaService.movie.update({
      where: { id },
      data: {
        poster_url: updateMovieDto.file,
      },
    });
  }

  remove(id: number) {
    return this.prismaService.movie.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });
  }
}
