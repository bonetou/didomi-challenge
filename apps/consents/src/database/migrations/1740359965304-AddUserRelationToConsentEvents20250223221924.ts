import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserRelationToConsentEvents202502232219241740359965304
  implements MigrationInterface
{
  name = 'AddUserRelationToConsentEvents202502232219241740359965304';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "consent_events" ADD CONSTRAINT "FK_a00b8a97158096efa24ffc0521d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "consent_events" DROP CONSTRAINT "FK_a00b8a97158096efa24ffc0521d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`,
    );
  }
}
