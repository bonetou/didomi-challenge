import { DatabaseModule } from '@app/database';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConsentEventsModule } from './consent-events/consent-events.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'apps/consents/.env' }),
    DatabaseModule,
    ConsentEventsModule,
  ],
})
export class AppModule {}
