import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCreatedAtToUsersTable202502232052231740354744068
  implements MigrationInterface
{
  name = 'AddCreatedAtToUsersTable202502232052231740354744068';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`);
  }
}
