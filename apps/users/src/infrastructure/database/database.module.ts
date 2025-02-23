import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        autoLoadModels: true,
        autoLoadEntities: true,
        type: 'postgres',
        url: configService.getOrThrow<string>('DATABASE_URL'),
        logging: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
