import { Module } from '@nestjs/common';
import { GenreModule } from './genre/genre.module';
import { ActorModule } from './actor/actor.module';
import { MovieModule } from './movie/movie.module';

@Module({
  imports: [GenreModule, ActorModule, MovieModule],
})
export class AdminModule {}
