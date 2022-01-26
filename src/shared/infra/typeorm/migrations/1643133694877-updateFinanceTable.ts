import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class updateFinanceTable1643133694877 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('finances', [
      new TableColumn({
        name: 'tag_id',
        type: 'uuid',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('habits', [
      new TableColumn({
        name: 'tag_id',
        type: 'uuid',
      }),
    ]);
  }
}
