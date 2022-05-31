import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixIdentityColumnUser1653903897707 implements MigrationInterface {
  name = 'FixIdentityColumnUser1653903897707';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_purchase_histories\` DROP FOREIGN KEY \`FK_c55a2f87186be52e8cc61642621\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`id\` \`id\` int NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`users\` DROP PRIMARY KEY`);
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`id\``);
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`id\` int NOT NULL PRIMARY KEY`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_purchase_histories\` ADD CONSTRAINT \`FK_c55a2f87186be52e8cc61642621\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_purchase_histories\` DROP FOREIGN KEY \`FK_c55a2f87186be52e8cc61642621\``,
    );
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`id\``);
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`id\` int NOT NULL AUTO_INCREMENT`,
    );
    await queryRunner.query(`ALTER TABLE \`users\` ADD PRIMARY KEY (\`id\`)`);
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_purchase_histories\` ADD CONSTRAINT \`FK_c55a2f87186be52e8cc61642621\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
