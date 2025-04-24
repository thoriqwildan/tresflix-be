/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { PaginationResponseDto } from 'src/utils/dto/pagination-response.dto';
import { PaginationDto } from 'src/utils/dto/pagination.dto';

@Injectable()
export class ActorRepositories {
  constructor(private prismaService: PrismaService) {}

  async findManyWithPagination(
    paginationDto: PaginationDto,
  ): Promise<PaginationResponseDto<any[]>> {
    const { page, limit } = paginationDto;
    const skip = (page! - 1) * limit!;

    const [data, total] = await Promise.all([
      this.prismaService.actor.findMany({
        skip,
        take: Number(limit),
        orderBy: { id: 'asc' },
        select: {
          id: true,
          name: true,
          biography: true,
          birth_date: true,
          profile_url: true,
          created_at: true,
        },
      }),
      this.prismaService.actor.count(),
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
