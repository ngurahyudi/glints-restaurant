import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeleteRelation1659944158709 implements MigrationInterface {
  name = 'DeleteRelation1659944158709';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_purchase_histories\` DROP FOREIGN KEY \`FK_0aa1f745f205a725f93a44820a0\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_purchase_histories\` DROP COLUMN \`restaurant_id\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_purchase_histories\` ADD \`restaurant_id\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_purchase_histories\` ADD CONSTRAINT \`FK_0aa1f745f205a725f93a44820a0\` FOREIGN KEY (\`restaurant_id\`) REFERENCES \`restaurants\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
