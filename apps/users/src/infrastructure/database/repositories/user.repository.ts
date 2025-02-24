import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { UserAggregate } from '../../../domain/aggregates/user.aggregate';
import { UserAggregateMapper } from '../mappers/user-aggregate.mapper';
import { UserModel } from '../models/user.model';
import { ConsentModel } from '../models/consent.model';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
    @InjectRepository(ConsentModel)
    private readonly consentRepository: Repository<ConsentModel>,
  ) {}

  async findById(id: string): Promise<UserAggregate | null> {
    const userEntity = await this.userRepository.findOne({
      where: { id },
      relations: ['consents'],
    });

    return userEntity ? UserAggregateMapper.toDomain(userEntity) : null;
  }

  async findByEmail(email: string): Promise<UserAggregate | null> {
    const userEntity = await this.userRepository.findOne({
      where: { email },
      relations: ['consents'],
    });

    return userEntity ? UserAggregateMapper.toDomain(userEntity) : null;
  }

  async create(userAggregate: UserAggregate): Promise<void> {
    const userEntity = UserAggregateMapper.toPersistence(userAggregate);
    await this.userRepository.save(userEntity);
  }

  async delete(email: string): Promise<void> {
    await this.userRepository.delete({ email });
  }

  async update(userAggregate: UserAggregate): Promise<void> {
    const userEntity = UserAggregateMapper.toPersistence(userAggregate);

    await this.userRepository.update(userAggregate.user.id, {
      id: userEntity.id,
      email: userEntity.email,
    });

    await Promise.all(
      userAggregate.getCurrentConsents().map(async (c) => {
        await this.consentRepository.save({
          id: c.id,
          userId: c.userId,
          enabled: c.enabled,
        });
      }),
    );
  }

  async exists(email: string): Promise<boolean> {
    const count = await this.userRepository.count({ where: { email } });
    return count > 0;
  }
}
