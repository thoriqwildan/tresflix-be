import { Module } from '@nestjs/common';
import { GenreService } from './genre.service';
import { GenreController } from './genre.controller';
import { GenreRepositories } from './repositories/genre.repository';

@Module({
  controllers: [GenreController],
  providers: [GenreService, GenreRepositories],
})
export class GenreModule {}
