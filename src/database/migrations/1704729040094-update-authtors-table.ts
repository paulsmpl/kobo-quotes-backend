/* eslint-disable @typescript-eslint/naming-convention */
import type { MigrationInterface, QueryRunner } from 'typeorm';

export class updateAuthtorsTable1704729040094 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE authors MODIFY author_name TEXT');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE authors MODIFY author_name VARCHAR(255)',
    );
  }
}
