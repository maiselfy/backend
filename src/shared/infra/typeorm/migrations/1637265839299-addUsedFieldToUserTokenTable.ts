import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addUsedFieldToUserTokenTable1637265839299
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user-tokens',
      new TableColumn({
        name: 'used',
        type: 'boolean',
        isNullable: true,
        default: 'false',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user-tokens', 'used');
  }
}
