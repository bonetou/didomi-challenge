import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from '../../infrastructure/database/models/user.model';
import { TypeOrmUserRepository } from '../../infrastructure/database/repositories/user.repository';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { ConsentModel } from '../../infrastructure/database/models/consent.model';
import { GetUserUseCase } from './get-user.use-case';
import { DeleteUserUseCase } from './delete-user.use-case';
import { RabbitMQEventBus, RabbitMQModule } from 'libs/messaging/src';
import { ConsentChangedUseCase } from './consent-changed.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserModel, ConsentModel]),
    RabbitMQModule,
  ],
  providers: [
    CreateUserUseCase,
    GetUserUseCase,
    DeleteUserUseCase,
    ConsentChangedUseCase,
    {
      provide: 'USER_REPOSITORY',
      useClass: TypeOrmUserRepository,
    },
    {
      provide: 'EVENT_BUS',
      useClass: RabbitMQEventBus,
    },
  ],
  exports: [
    CreateUserUseCase,
    GetUserUseCase,
    DeleteUserUseCase,
    ConsentChangedUseCase,
  ],
})
export class UseCasesModule {}
