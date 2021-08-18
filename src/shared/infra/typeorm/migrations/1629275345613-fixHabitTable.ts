import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class fixHabitTable1629275345613 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('habits', [
      new TableColumn({
        name: 'buddy_id',
        type: 'uuid',
      }),
    ]);
    await queryRunner.addColumns('habits', [
      new TableColumn({
        name: 'buddy_id',
        type: 'uuid',
        isNullable: true,
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
        name: 'buddy_id',
        type: 'uuid',
      }),
    ]);
    await queryRunner.addColumns('habits', [
      new TableColumn({
        name: 'buddy_id',
        type: 'uuid',
        isNullable: true,
      }),
    ]);
  }
}
