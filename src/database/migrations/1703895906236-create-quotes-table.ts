import type { MigrationInterface, QueryRunner } from 'typeorm';
import { Table } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/naming-convention
export class createQuotesTable1703895906236 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'quotes',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'author_id',
            type: 'int',
            isUnique: false,
            isNullable: true,
          },
          {
            name: 'book_id',
            type: 'int',
            isUnique: false,
            isNullable: true,
          },
          {
            name: 'quote',
            type: 'text',
            isUnique: false,
            isNullable: true,
          },
          {
            name: 'position',
            type: 'int',
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
    await queryRunner.dropTable('quotes');
  }
}
