import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class createHabitCheckTable1619030693360 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'habit_check',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'habit_id',
            type: 'uuid',
          },
          {
            name: 'done',
            type: 'boolean',
          },
          {
            name: 'date',
            type: 'Date',
          },
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
      'habit_check',
      new TableForeignKey({
        name: 'HabitCheck',
        columnNames: ['habit_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'habits',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('habit_check', 'HabitCheck');
    await queryRunner.dropTable('habit_check');
  }
}
