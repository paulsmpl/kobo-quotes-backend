import type { MigrationInterface, QueryRunner } from 'typeorm';
import { Table } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/naming-convention
export class createBooksTable1703895121140 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'books',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'book_name',
            type: 'varchar',
            isUnique: false,
            isNullable: true,
          },
          {
            name: 'enabled',
            type: 'tinyint',
            length: '1',
            isUnique: false,
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            isNullable: true,
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: true,
            default: 'now()',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('books');
  }
}
