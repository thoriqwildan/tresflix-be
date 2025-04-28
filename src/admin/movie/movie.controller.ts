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
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { JwtRoleGuard } from 'src/auth/guards/jwtrole.guard';
import { ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs-extra';
import * as sharp from 'sharp';
import { PaginationDto } from 'src/utils/dto/pagination.dto';

@Controller('movies')
export class MovieController {
  constructor(
    private readonly movieService: MovieService,
    private configService: ConfigService,
  ) {}

  @Post()
  @UseGuards(JwtRoleGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('poster', {
      storage: diskStorage({
        destination: './uploads/movies',
        filename(req, file, callback) {
          const date = new Date()
            .toISOString()
            .replace(/:/g, '-')
            .replace('T', '_')
            .replace('Z', '');
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
    @UploadedFile() poster: Express.Multer.File,
    @Body(new ValidationPipe({ transform: true }))
    createMovieDto: CreateMovieDto,
  ) {
    console.log(createMovieDto.genres);
    console.log(createMovieDto.actors);
    if (poster) {
      const title = createMovieDto.title.replace(/\s+/g, '-').toLowerCase();
      const date = new Date().toISOString().split('T')[0];
      const extension: string = path.extname(poster.originalname);
      const filename = `${title}-${date}${extension}`;
      const oldPath = poster.path;
      const newPath = path.join(path.dirname(oldPath), filename);

      const dirPath = `${this.configService.get('folders')}/movies`;
      try {
        await fs.ensureDir(dirPath); // just in case folder belum ada
        const files = await fs.readdir(dirPath);
        const filteredFiles = files.filter((f) => f.includes(title));

        await Promise.all(
          filteredFiles.map(async (f) => {
            const filePath = path.join(dirPath, f);
            try {
              console.log('Image Rmove');
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
          .resize(304, 450)
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
      createMovieDto.file = `/movies/${filename}`;
    }

    return await this.movieService.create(createMovieDto);
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    if (!paginationDto.page) {
      paginationDto.page = 1;
    }
    if (!paginationDto.limit) {
      paginationDto.limit = 10;
    }

    return await this.movieService.findAll(paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    if (!id) {
      throw new BadRequestException('Ga ketemu');
    }
    return await this.movieService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtRoleGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('poster', {
      storage: diskStorage({
        destination: './uploads/movies',
        filename(req, file, callback) {
          const date = new Date()
            .toISOString()
            .replace(/:/g, '-')
            .replace('T', '_')
            .replace('Z', '');
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
    @UploadedFile() picture: Express.Multer.File,
    @Body(new ValidationPipe({ transform: true }))
    updateMovieDto: UpdateMovieDto,
  ) {
    const data = await this.movieService.update(id, updateMovieDto);
    if (picture) {
      const title = data.title.replace(/\s+/g, '-').toLowerCase();
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
              console.log('Image Rmove');
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
          .resize(304, 450)
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
      updateMovieDto.file = `/movies/${filename}`;
    }
    return await this.movieService.updateMoviePicture(id, updateMovieDto);
  }

  @Delete(':id')
  @UseGuards(JwtRoleGuard)
  @ApiBearerAuth()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.movieService.remove(id);
  }
}
