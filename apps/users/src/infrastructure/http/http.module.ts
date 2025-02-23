import { Module } from '@nestjs/common';
import { UserController } from './controllers/users.controller';
import { UseCasesModule } from '../../application/use-cases/use-case.module';

@Module({
  imports: [UseCasesModule],
  controllers: [UserController],
})
export class HttpModule {}
