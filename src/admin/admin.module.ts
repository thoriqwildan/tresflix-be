import { Module } from '@nestjs/common';
import { GenreModule } from './genre/genre.module';

@Module({
  imports: [GenreModule]
})
export class AdminModule {}
