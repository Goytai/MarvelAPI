import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class RelationUsersCharacters1622142090421
  implements MigrationInterface
{
  name = 'RelationUsersCharacters1622142090421';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users_characters',
        columns: [
          {
            name: 'user_id',
            type: 'bigint'
          },
          {
            name: 'character_id',
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
            columnNames: ['character_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'characters',
            onUpdate: 'cascade',
            onDelete: 'cascade'
          }
        ]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users_characters');
  }
}
