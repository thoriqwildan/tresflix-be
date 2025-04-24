import { Module } from '@nestjs/common';
import { GenreModule } from './genre/genre.module';
import { ActorModule } from './actor/actor.module';

@Module({
  imports: [GenreModule, ActorModule],
})
export class AdminModule {}
