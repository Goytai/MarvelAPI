import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class RelationUsersComics1622155808903
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users_comics',
        columns: [
          {
            name: 'user_id',
            type: 'bigint'
          },
          {
            name: 'comic_id',
            type: 'bigint'
          }
        ],
        foreignKeys: [
          {
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onUpdate: 'cascade',
            onDelete: 'cascade'
          },
          {
            columnNames: ['comic_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'comics',
            onUpdate: 'cascade',
            onDelete: 'cascade'
          }
        ]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users_comics');
  }
}
