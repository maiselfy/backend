import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class addTagForeignKeyForFinanceTable1642602830207
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'finances',
      new TableForeignKey({
        name: 'TagFinance',
        columnNames: ['tag_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tags',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('finances', 'TagFinance');
  }
}
