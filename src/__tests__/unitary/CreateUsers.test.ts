import User from '@modules/users/entities/User';
import CreateUserService from '@modules/users/services/CreateUserServices';
import { Connection, createConnection, Repository } from 'typeorm';

describe('User Service', () => {
  let conn: Connection;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    conn = await createConnection('test');
    userRepository = conn.getRepository(User);
  });

  afterEach(async () => {
    await userRepository.delete({});
  });

  it('should able create a new user', async () => {
    const createUserService = new CreateUserService(userRepository);

    const user = {
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: 'johndoe123'
    };

    const response = await createUserService.execute(user);

    expect(response).toHaveProperty('id');
    expect(response).toHaveProperty('active');
    expect(response).toHaveProperty('updated_at');
    expect(response).toHaveProperty('created_at');
    expect(response.name).toBe(user.name);
    expect(response.email).toBe(user.email);
  });

  it('should not able create a new user with same email from another', async () => {
    const createUserService = new CreateUserService(userRepository);

    const user = {
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: 'johndoe123'
    };

    await createUserService.execute(user);

    expect(createUserService.execute(user)).rejects.toThrowError(
      new Error('Email andress already used')
    );
  });
});
