import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from './infrastructure/http/http.module';
import { DatabaseModule } from '@app/database';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'apps/users/.env' }),
    DatabaseModule,
    HttpModule,
  ],
})
export class AppModule {}
