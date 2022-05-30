import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1653457514699 implements MigrationInterface {
  name = 'Init1653457514699';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`restaurants\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_by\` varchar(25) NOT NULL DEFAULT 'SYSTEM', \`updated_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_by\` varchar(25) NOT NULL DEFAULT 'SYSTEM', \`deleted_date\` datetime(6) NULL, \`data_version\` int NOT NULL, \`name\` varchar(255) NOT NULL, \`cash_balance\` decimal(15,2) NOT NULL DEFAULT '0.00', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`restaurant_operating_hours\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_by\` varchar(25) NOT NULL DEFAULT 'SYSTEM', \`updated_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_by\` varchar(25) NOT NULL DEFAULT 'SYSTEM', \`deleted_date\` datetime(6) NULL, \`data_version\` int NOT NULL, \`day\` enum ('1', '2', '3', '4', '5', '6', '7') NOT NULL DEFAULT '1', \`open_time\` time NOT NULL, \`close_time\` time NOT NULL, \`restaurant_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_by\` varchar(25) NOT NULL DEFAULT 'SYSTEM', \`updated_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_by\` varchar(25) NOT NULL DEFAULT 'SYSTEM', \`deleted_date\` datetime(6) NULL, \`data_version\` int NOT NULL, \`name\` varchar(255) NOT NULL, \`cashBalance\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_purchase_histories\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_by\` varchar(25) NOT NULL DEFAULT 'SYSTEM', \`updated_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_by\` varchar(25) NOT NULL DEFAULT 'SYSTEM', \`deleted_date\` datetime(6) NULL, \`data_version\` int NOT NULL, \`transaction_amount\` decimal(15,2) NOT NULL DEFAULT '0.00', \`user_id\` int NOT NULL, \`menu_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`restaurant_menus\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_by\` varchar(25) NOT NULL DEFAULT 'SYSTEM', \`updated_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_by\` varchar(25) NOT NULL DEFAULT 'SYSTEM', \`deleted_date\` datetime(6) NULL, \`data_version\` int NOT NULL, \`name\` varchar(255) NOT NULL, \`price\` decimal(15,2) NOT NULL DEFAULT '0.00', \`restaurant_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`restaurant_operating_hours\` ADD CONSTRAINT \`FK_4a7f4688687089abb7873451f55\` FOREIGN KEY (\`restaurant_id\`) REFERENCES \`restaurants\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_purchase_histories\` ADD CONSTRAINT \`FK_c55a2f87186be52e8cc61642621\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_purchase_histories\` ADD CONSTRAINT \`FK_7db1fe3d7f82644750c7d05d810\` FOREIGN KEY (\`menu_id\`) REFERENCES \`restaurant_menus\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`restaurant_menus\` ADD CONSTRAINT \`FK_5d74940c5e254afe390f50c4acb\` FOREIGN KEY (\`restaurant_id\`) REFERENCES \`restaurants\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`restaurant_menus\` DROP FOREIGN KEY \`FK_5d74940c5e254afe390f50c4acb\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_purchase_histories\` DROP FOREIGN KEY \`FK_7db1fe3d7f82644750c7d05d810\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_purchase_histories\` DROP FOREIGN KEY \`FK_c55a2f87186be52e8cc61642621\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`restaurant_operating_hours\` DROP FOREIGN KEY \`FK_4a7f4688687089abb7873451f55\``,
    );
    await queryRunner.query(`DROP TABLE \`restaurant_menus\``);
    await queryRunner.query(`DROP TABLE \`user_purchase_histories\``);
    await queryRunner.query(`DROP TABLE \`users\``);
    await queryRunner.query(`DROP TABLE \`restaurant_operating_hours\``);
    await queryRunner.query(`DROP TABLE \`restaurants\``);
  }
}
