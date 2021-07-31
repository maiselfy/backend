import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class createTableHabitDayCheck1625013168065
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'habits-days-check',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'date', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'user_id', type: 'uuid' },
          { name: 'habit_id', type: 'uuid' },
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
      'habits-days-check',
      new TableForeignKey({
        name: 'HabitDayCheckUser',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'habits-days-check',
      new TableForeignKey({
        name: 'HabitDayCheckHabit',
        columnNames: ['habit_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'habits',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('habits-days-check', 'HabitDayCheckHabit');
    await queryRunner.dropForeignKey('habits-days-check', 'HabitDayCheckUser');
    await queryRunner.dropTable('habits-days-check');
  }
}
