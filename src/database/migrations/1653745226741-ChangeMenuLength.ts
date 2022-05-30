import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeMenuLength1653745226741 implements MigrationInterface {
  name = 'ChangeMenuLength1653745226741';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`restaurant_menus\` DROP COLUMN \`name\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`restaurant_menus\` ADD \`name\` varchar(500) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`restaurant_menus\` DROP COLUMN \`name\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`restaurant_menus\` ADD \`name\` varchar(255) NOT NULL`,
    );
  }
}
