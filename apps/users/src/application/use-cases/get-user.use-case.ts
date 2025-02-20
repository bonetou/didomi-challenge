import { Inject, Injectable } from '@nestjs/common';
import { UserAggregate } from '../../domain/aggregates/user.aggregate';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UseCase } from './use-case.interface';

@Injectable()
export class GetUserUseCase implements UseCase<string, UserAggregate | null> {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(email: string): Promise<UserAggregate | null> {
    return await this.userRepository.findByEmail(email);
  }
}
