import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class createFinancesTable1642595924435 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'finances',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'description', type: 'varchar' },
          { name: 'value', type: 'float' },
          { name: 'date', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          {
            name: 'tag_id',
            type: 'uuid',
          },
          { name: 'user_id', type: 'uuid' },
          { name: 'status', type: 'boolean' },
          { name: 'type', type: 'varchar' },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'finances',
      new TableForeignKey({
        name: 'UserFinance',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('finances', 'UserFinance');
    await queryRunner.dropTable('finances');
  }
}
