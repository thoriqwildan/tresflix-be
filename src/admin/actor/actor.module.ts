import { Module } from '@nestjs/common';
import { ActorService } from './actor.service';
import { ActorController } from './actor.controller';
import { ActorRepositories } from './repositories/actor.repository';

@Module({
  controllers: [ActorController],
  providers: [ActorService, ActorRepositories],
})
export class ActorModule {}
