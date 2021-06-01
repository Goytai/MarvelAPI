import User from '@modules/users/entities/User';
import FindUserServices from '@modules/users/services/FindUserServices';
import AppError from '@shared/errors/AppError';

import { Connection, createConnection, Repository } from 'typeorm';

describe('Find User Service', () => {
  let conn: Connection;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    conn = await createConnection('test');
    userRepository = conn.getRepository(User);
  });

  afterEach(async () => {
    userRepository.delete({});
  });

  it('should be able find', async () => {
    const user = await userRepository.save({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: 'johndoe123'
    });

    const findUserServices = new FindUserServices(userRepository);

    const response = await findUserServices.execute({ user_id: user.id });

    expect(response).toBeInstanceOf(User);
  });

  it('should be not able find', async () => {
    const findUserServices = new FindUserServices(userRepository);

    const response = findUserServices.execute({ user_id: -1 });

    await expect(response).rejects.toBeInstanceOf(AppError);
  });
});
