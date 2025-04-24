import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';
import { PrismaService } from 'src/database/prisma.service';
import { ActorRepositories } from './repositories/actor.repository';
import { PaginationDto } from 'src/utils/dto/pagination.dto';

@Injectable()
export class ActorService {
  constructor(
    private prismaService: PrismaService,
    private actorRepository: ActorRepositories,
  ) {}

  async create(createActorDto: CreateActorDto) {
    const birthDate = new Date(createActorDto.birthDate);
    const data = await this.prismaService.actor.create({
      data: {
        name: createActorDto.name,
        biography: createActorDto.biography,
        birth_date: birthDate,
        profile_url: createActorDto.file,
      },
      select: {
        id: true,
        name: true,
        biography: true,
        birth_date: true,
        profile_url: true,
      },
    });
    return data;
  }

  async findAll(paginationDto: PaginationDto) {
    return await this.actorRepository.findManyWithPagination(paginationDto);
  }

  async findOne(id: number) {
    const data = await this.prismaService.actor.findFirst({
      where: { id },
    });
    if (!data) {
      throw new BadRequestException('Actor not found');
    }
    return data;
  }

  update(id: number, updateActorDto: UpdateActorDto) {
    return `This action updates a #${id} actor`;
  }

  remove(id: number) {
    return `This action removes a #${id} actor`;
  }
}
