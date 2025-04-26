import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { RateModule } from './rate/rate.module';
import { WatchlistModule } from './watchlist/watchlist.module';
import { HomeModule } from './home/home.module';
import configuration from './config/configuration';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    AdminModule,
    RateModule,
    WatchlistModule,
    HomeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
