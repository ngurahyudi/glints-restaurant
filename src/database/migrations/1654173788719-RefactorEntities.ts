import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefactorEntities1654173788719 implements MigrationInterface {
  name = 'RefactorEntities1654173788719';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`cashBalance\` \`cash_balance\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_purchase_histories\` ADD \`restaurant_id\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP COLUMN \`cash_balance\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`cash_balance\` decimal(15,2) NOT NULL DEFAULT '0.00'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_purchase_histories\` ADD CONSTRAINT \`FK_0aa1f745f205a725f93a44820a0\` FOREIGN KEY (\`restaurant_id\`) REFERENCES \`restaurants\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_purchase_histories\` DROP FOREIGN KEY \`FK_0aa1f745f205a725f93a44820a0\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP COLUMN \`cash_balance\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`cash_balance\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_purchase_histories\` DROP COLUMN \`restaurant_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`cash_balance\` \`cashBalance\` int NOT NULL`,
    );
  }
}
