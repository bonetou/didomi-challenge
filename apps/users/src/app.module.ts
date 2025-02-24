import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from './infrastructure/http/http.module';
import { DatabaseModule } from '@app/database';
import { MessagingModule } from './infrastructure/messaging/messaging.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'apps/users/.env' }),
    DatabaseModule,
    HttpModule,
    MessagingModule,
  ],
})
export class AppModule {}
