import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueConstraintToConsentsTable202502240001461740366106812
  implements MigrationInterface
{
  name = 'AddUniqueConstraintToConsentsTable202502240001461740366106812';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "consents" DROP CONSTRAINT "FK_7736e32000c01e8e189d1d4a0dd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "consents" DROP CONSTRAINT "PK_9efc68eb6aba7d638fb6ea034dd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "consents" ADD CONSTRAINT "PK_2abd9d4a7991037161591c2efb0" PRIMARY KEY ("id", "userId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "consents" DROP CONSTRAINT "PK_2abd9d4a7991037161591c2efb0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "consents" ADD CONSTRAINT "PK_7736e32000c01e8e189d1d4a0dd" PRIMARY KEY ("userId")`,
    );
    await queryRunner.query(`ALTER TABLE "consents" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "consents" ADD "id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "consents" DROP CONSTRAINT "PK_7736e32000c01e8e189d1d4a0dd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "consents" ADD CONSTRAINT "PK_2abd9d4a7991037161591c2efb0" PRIMARY KEY ("userId", "id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "consents" ALTER COLUMN "userId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "consents" ADD CONSTRAINT "UQ_2abd9d4a7991037161591c2efb0" UNIQUE ("id", "userId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "consents" ADD CONSTRAINT "FK_7736e32000c01e8e189d1d4a0dd" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "consents" DROP CONSTRAINT "FK_7736e32000c01e8e189d1d4a0dd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "consents" DROP CONSTRAINT "UQ_2abd9d4a7991037161591c2efb0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "consents" ALTER COLUMN "userId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "consents" DROP CONSTRAINT "PK_2abd9d4a7991037161591c2efb0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "consents" ADD CONSTRAINT "PK_7736e32000c01e8e189d1d4a0dd" PRIMARY KEY ("userId")`,
    );
    await queryRunner.query(`ALTER TABLE "consents" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "consents" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "consents" DROP CONSTRAINT "PK_7736e32000c01e8e189d1d4a0dd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "consents" ADD CONSTRAINT "PK_2abd9d4a7991037161591c2efb0" PRIMARY KEY ("id", "userId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "consents" DROP CONSTRAINT "PK_2abd9d4a7991037161591c2efb0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "consents" ADD CONSTRAINT "PK_9efc68eb6aba7d638fb6ea034dd" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "consents" ADD CONSTRAINT "FK_7736e32000c01e8e189d1d4a0dd" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
