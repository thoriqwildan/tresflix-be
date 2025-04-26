import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { MovieRepositories } from './repositories/movie.repository';

@Module({
  controllers: [MovieController],
  providers: [MovieService, MovieRepositories],
})
export class MovieModule {}
