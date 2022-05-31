import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTrancationDate1653891589895 implements MigrationInterface {
  name = 'AddTrancationDate1653891589895';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_purchase_histories\` ADD \`transaction_date\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_purchase_histories\` DROP COLUMN \`transaction_date\``,
    );
  }
}
