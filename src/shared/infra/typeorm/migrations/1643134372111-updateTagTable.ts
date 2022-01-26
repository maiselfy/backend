import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class updateTagTable1643134372111 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('tags', [
      new TableColumn({
        name: 'finance_id',
        type: 'uuid',
      }),
    ]);

    await queryRunner.createForeignKey(
      'tags',
      new TableForeignKey({
        name: 'TagFinance',
        columnNames: ['finance_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'finances',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('finances', 'TagFinance');
    await queryRunner.dropColumns('finances', [
      new TableColumn({
        name: 'finance_id',
        type: 'uuid',
      }),
    ]);
  }
}
