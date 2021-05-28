import User from '@modules/users/entities/User';
import { Connection, Repository, createConnection } from 'typeorm';

describe('', () => {
  let conn: Connection;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    conn = await createConnection('test');
    userRepository = conn.getRepository(User);
  });

  afterAll(async () => {
    await userRepository.delete({});
  });

  it('', async () => {
    await userRepository.save({});

    expect(true).toBe(true);
  });
});
