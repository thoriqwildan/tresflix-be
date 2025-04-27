/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
      select: {
        id: true,
        name: true,
        biography: true,
        birth_date: true,
        profile_url: true,
        created_at: true,
      },
    });
    if (!data) {
      throw new BadRequestException('Actor not found');
    }
    return data;
  }

  async update(id: number, updateActorDto: UpdateActorDto) {
    const checkActor = await this.prismaService.actor.count({
      where: { id },
    });
    if (!checkActor) {
      throw new BadRequestException('Actor Not Found!');
    }

    // Persiapkan data update secara dinamis
    const updateData: any = {};

    if (updateActorDto.name !== undefined) {
      updateData.name = updateActorDto.name;
    }

    if (updateActorDto.biography !== undefined) {
      updateData.biography = updateActorDto.biography;
    }

    if (updateActorDto.birthDate !== undefined) {
      updateData.birth_date = new Date(updateActorDto.birthDate);
    }

    if (updateActorDto.file !== undefined) {
      updateData.profile_url = updateActorDto.file;
    }

    const data = await this.prismaService.actor.update({
      where: { id },
      data: updateData,
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

  async updateLinkFile(id: number, file: string) {
    return await this.prismaService.actor.update({
      where: { id },
      data: { profile_url: file },
    });
  }

  async remove(id: number) {
    const data = await this.prismaService.actor.delete({
      where: { id: id },
    });
    if (!data) {
      throw new BadRequestException('Data not Found');
    }
    return data;
  }
}
