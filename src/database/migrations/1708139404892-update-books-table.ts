/* eslint-disable @typescript-eslint/naming-convention */
import type { MigrationInterface, QueryRunner } from 'typeorm';

export class updateBooksTable1708139404892 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE books ADD author_id INT AFTER book_name',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE books DROP COLUMN author_id');
  }
}
