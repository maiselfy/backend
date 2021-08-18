import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class createTableNotes1629268319103 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'notes-habit',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'note', type: 'varchar', default: 'CURRENT_TIMESTAMP' },
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
      'notes-habit',
      new TableForeignKey({
        name: 'NoteUser',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'notes-habit',
      new TableForeignKey({
        name: 'NoteHabit',
        columnNames: ['habit_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'habits',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('notes-habit', 'NoteHabit');
    await queryRunner.dropForeignKey('notes-habit', 'NoteUser');
    await queryRunner.dropTable('notes-habit');
  }
}
