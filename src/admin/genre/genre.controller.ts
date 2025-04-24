import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { JwtRoleGuard } from 'src/auth/guards/jwtrole.guard';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/utils/dto/pagination.dto';

@Controller('genres')
@ApiTags('Genres')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Post()
  @UseGuards(JwtRoleGuard)
  @ApiCookieAuth()
  create(@Body() createGenreDto: CreateGenreDto) {
    return this.genreService.create(createGenreDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    if (!paginationDto.page) {
      paginationDto.page = 1;
    }
    if (!paginationDto.limit) {
      paginationDto.limit = 10;
    }
    return this.genreService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.genreService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtRoleGuard)
  @ApiCookieAuth()
  update(@Param('id') id: string, @Body() updateGenreDto: UpdateGenreDto) {
    return this.genreService.update(+id, updateGenreDto);
  }

  @Delete(':id')
  @UseGuards(JwtRoleGuard)
  @ApiCookieAuth()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.genreService.remove(id);
  }
}
