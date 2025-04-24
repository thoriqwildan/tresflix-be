import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { PrismaService } from 'src/database/prisma.service';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { GenreRepositories } from './repositories/genre.repository';

@Injectable()
export class GenreService {
  constructor(
    private prismaService: PrismaService,
    private genreRepository: GenreRepositories,
  ) {}

  async create(createGenreDto: CreateGenreDto) {
    const checkGenre = await this.prismaService.genre.findUnique({
      where: { name: createGenreDto.genre },
    });
    if (checkGenre) {
      throw new BadRequestException('Genre already exists');
    }

    return this.prismaService.genre.create({
      data: { name: createGenreDto.genre },
      select: { id: true, name: true, created_at: true },
    });
  }

  async findAll(paginationDto: PaginationDto) {
    return await this.genreRepository.findManyWithPagination(paginationDto);
  }

  async findOne(id: number) {
    const data = await this.prismaService.genre.findFirst({
      where: { id },
      select: { id: true, name: true, created_at: true },
    });
    if (!data) {
      throw new BadRequestException('Genre not found');
    }
    return data;
  }

  async update(id: number, updateGenreDto: UpdateGenreDto) {
    const checkGenre = await this.prismaService.genre.findFirst({
      where: { id: id },
      select: { id: true, name: true, created_at: true },
    });
    if (!checkGenre) {
      throw new BadRequestException('Genre not found');
    }
    const checkGenreName = await this.prismaService.genre.findUnique({
      where: { name: updateGenreDto.genre },
    });
    if (checkGenreName) {
      throw new BadRequestException('Genre already exists');
    }
    const data = await this.prismaService.genre.update({
      where: { id: id },
      data: { name: updateGenreDto.genre },
      select: { id: true, name: true, created_at: true },
    });
    return data;
  }

  async remove(id: number) {
    const checkGenre = await this.prismaService.genre.findFirst({
      where: { id: id },
    });
    if (!checkGenre) {
      throw new BadRequestException('Genre not found');
    }
    await this.prismaService.genre.delete({
      where: { id: id },
    });

    return `Genre Deleted!`;
  }
}
