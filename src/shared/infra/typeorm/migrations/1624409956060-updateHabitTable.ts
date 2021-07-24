import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class updateHabitTable1624409956060 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('habits', [
      new TableColumn({
        name: 'reminder_question',
        type: 'varchar',
      }),
      new TableColumn({
        name: 'frequency',
        type: 'varchar',
      }),
      new TableColumn({
        name: 'reminder',
        type: 'boolean',
      }),
      new TableColumn({
        name: 'pontuation',
        type: 'integer',
      }),
    ]);
    await queryRunner.addColumns('habits', [
      new TableColumn({
        name: 'objective',
        type: 'varchar',
      }),
      new TableColumn({
        name: 'buddy_id',
        type: 'uuid',
      }),
    ]);

    await queryRunner.createForeignKey(
      'habits',
      new TableForeignKey({
        name: 'UserBuddy',
        columnNames: ['buddy_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('habits', 'UserBuddy');
    await queryRunner.dropColumns('habits', [
      new TableColumn({
        name: 'objective',
        type: 'varchar',
      }),
      new TableColumn({
        name: 'buddy_id',
        type: 'uuid',
      }),
    ]);
    await queryRunner.addColumns('habits', [
      new TableColumn({
        name: 'reminder_question',
        type: 'varchar',
      }),
      new TableColumn({
        name: 'frequency',
        type: 'varchar',
      }),
      new TableColumn({
        name: 'reminder',
        type: 'varchar',
      }),
      new TableColumn({
        name: 'pontuation',
        type: 'integer',
      }),
    ]);
  }
}
