import { Controller, Get, Query } from '@nestjs/common';
import { HomeService } from './home.service';
import { PaginationDto } from 'src/utils/dto/pagination.dto';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get('new-movies')
  async getNewMovies(@Query() paginationDto: PaginationDto) {
    if (!paginationDto.page) {
      paginationDto.page = 1;
    }
    if (!paginationDto.limit) {
      paginationDto.limit = 10;
    }
    return await this.homeService.getNewMovies(paginationDto);
  }

  @Get('top-rated-movies')
  async getTopRatedMovies() {
    return await this.homeService.getTopRatedMovies();
  }
}
