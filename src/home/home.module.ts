import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { HomeRepositories } from './repositories/home.repository';

@Module({
  controllers: [HomeController],
  providers: [HomeService, HomeRepositories],
})
export class HomeModule {}
