/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  HttpException,
  UploadedFile,
  ValidationPipe,
  BadRequestException,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ActorService } from './actor.service';
import { CreateActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';
import { JwtRoleGuard } from 'src/auth/guards/jwtrole.guard';
import { ApiBody, ApiConsumes, ApiCookieAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as sharp from 'sharp';
import { PaginationDto } from 'src/utils/dto/pagination.dto';

@ApiCookieAuth()
@Controller('actors')
export class ActorController {
  constructor(
    private readonly actorService: ActorService,
    private configService: ConfigService,
  ) {}

  @Post()
  @UseGuards(JwtRoleGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateActorDto,
  })
  @UseInterceptors(
    FileInterceptor('picture', {
      storage: diskStorage({
        destination: './uploads/actors',
        filename(req, file, callback) {
          const date = new Date().toISOString().split('T')[0];
          const extension: string = path.extname(file.originalname);
          const filename = `${date}${extension}`;

          callback(null, filename);
        },
      }),
      fileFilter(req, file, callback) {
        const allowedTypes = /jpg|jpeg|png/;
        const extname = allowedTypes.test(
          path.extname(file.originalname).toLowerCase(),
        );
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) return callback(null, true);
        else
          return callback(
            new HttpException('Only JPG, JPEG, PNG files are allowed', 400),
            false,
          );
      },
      limits: { fileSize: 3 * 1024 * 1024 },
    }),
  )
  async create(
    @UploadedFile() picture: Express.Multer.File,
    @Body(new ValidationPipe({ transform: true }))
    createActorDto: CreateActorDto,
  ) {
    if (picture) {
      const title = createActorDto.name.replace(/\s+/g, '-').toLowerCase();
      const date = new Date().toISOString().split('T')[0];
      const extension: string = path.extname(picture.originalname);
      const filename = `${title}-${date}${extension}`;
      const oldPath = picture.path;
      const newPath = path.join(path.dirname(oldPath), filename);

      const dirPath = `${this.configService.get('folders')}/actors`;
      try {
        await fs.ensureDir(dirPath); // just in case folder belum ada
        const files = await fs.readdir(dirPath);
        const filteredFiles = files.filter((f) => f.includes(title));

        await Promise.all(
          filteredFiles.map(async (f) => {
            const filePath = path.join(dirPath, f);
            try {
              console.log('Image Rmove')
              await fs.remove(filePath);
            } catch (err) {
              console.error(`Failed to remove file ${filePath}:`, err);
            }
          }),
        );
      } catch (error) {
        throw new BadRequestException('Failed to delete old cover');
      }

      try {
        const buffer = await fs.readFile(oldPath); // baca jadi buffer
        await sharp(buffer)
          .resize(1024, 1024)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(newPath);
      } catch (err) {
        console.error('Image processing failed:', err);
        throw new BadRequestException('Image processing failed');
      }
      
      try {
        await fs.remove(oldPath); // sekarang aman hapus
      } catch (err) {
        console.error('Failed to delete temp file:', err);
      }
      createActorDto.file = `/actors/${filename}`;
    }

    return await this.actorService.create(createActorDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.actorService.findAll(paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.actorService.findOne(id);
  }

  @UseGuards(JwtRoleGuard)
  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Update Series',
    type: UpdateActorDto,
  })
  @UseInterceptors(
    FileInterceptor('picture', {
      storage: diskStorage({
        destination: './uploads/actors',
        filename(req, file, callback) {
          const date = new Date().toISOString().split('T')[0]; // "2025-04-24"
          const extension: string = path.extname(file.originalname);
          const filename = `${date}${extension}`;
          callback(null, filename);
        },
      }),
      fileFilter(req, file, callback) {
        const allowedTypes = /jpg|jpeg|png/;
        const extname = allowedTypes.test(
          path.extname(file.originalname).toLowerCase(),
        );
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) return callback(null, true);
        else
          return callback(
            new HttpException('Only JPG, JPEG, PNG files are allowed', 400),
            false,
          );
      },
      limits: { fileSize: 3 * 1024 * 1024 },
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() cover: Express.Multer.File,
    @Body(new ValidationPipe({ transform: true }))
    updateActorDto: UpdateActorDto,
  ) {
    if (cover) {
      const title = updateActorDto.name!.replace(/\s+/g, '-').toLowerCase();
      const date = new Date().toISOString().split('T')[0];
      const extension: string = path.extname(cover.originalname);
      const filename = `${title}-${date}${extension}`;
      const oldPath = cover.path;
      const newPath = path.join(path.dirname(oldPath), filename);

      const dirPath = `${this.configService.get('folders')}/actors`;

      try {
        await fs.ensureDir(dirPath); // just in case folder belum ada
        const files = await fs.readdir(dirPath);
        const filteredFiles = files.filter((f) => f.includes(title));

        await Promise.all(
          filteredFiles.map(async (f) => {
            const filePath = path.join(dirPath, f);
            try {
              console.log('Image Rmove')
              await fs.remove(filePath);
            } catch (err) {
              console.error(`Failed to remove file ${filePath}:`, err);
            }
          }),
        );
      } catch (error) {
        throw new BadRequestException('Failed to delete old cover');
      }

      try {
        const buffer = await fs.readFile(oldPath); // baca jadi buffer
        await sharp(buffer)
          .resize(1024, 1024)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(newPath);
      } catch (err) {
        console.error('Image processing failed:', err);
        throw new BadRequestException('Image processing failed');
      }
      
      try {
        await fs.remove(oldPath); // sekarang aman hapus
      } catch (err) {
        console.error('Failed to delete temp file:', err);
      }
      

      updateActorDto.file = `/actors/${filename}`;
    }

    return await this.actorService.update(id, updateActorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.actorService.remove(+id);
  }
}
