/* eslint-disable @typescript-eslint/naming-convention */
import type { MigrationInterface, QueryRunner } from 'typeorm';

export class updateQuotesTable1704817394596 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE quotes ADD start_container_path TEXT');
    await queryRunner.query('ALTER TABLE quotes ADD end_container_path TEXT');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE quotes DROP COLUMN start_container_path',
    );
    await queryRunner.query(
      'ALTER TABLE quotes DROP COLUMN end_container_path',
    );
  }
}
