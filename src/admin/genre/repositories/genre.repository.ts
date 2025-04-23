/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { PaginationResponseDto } from 'src/utils/dto/pagination-response.dto';
import { PaginationDto } from 'src/utils/dto/pagination.dto';

@Injectable()
export class GenreRepositories {
  constructor(private prismaService: PrismaService) {}

  async findManyWithPagination(
    paginationDto: PaginationDto,
  ): Promise<PaginationResponseDto<any[]>> {
    const { page, limit } = paginationDto;
    const skip = (page! - 1) * limit!;

    const [data, total] = await Promise.all([
      this.prismaService.genre.findMany({
        skip,
        take: Number(limit),
        orderBy: { id: 'asc' },
        where: { deleted_at: null },
        select: {
          id: true,
          name: true,
          created_at: true,
        },
      }),
      this.prismaService.genre.count({ where: { deleted_at: null } }),
    ]);

    return {
      data,
      total,
      page: Number(page!) || 1,
      limit: Number(limit!),
      totalPages: Math.ceil(total / Number(limit)),
    };
  }
}
