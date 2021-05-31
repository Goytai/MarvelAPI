import User from '@modules/users/entities/User';
import SessionService from '@modules/users/services/SessionServices';
import AppError from '@shared/errors/AppError';
import { hash } from 'bcrypt';
import { Connection, createConnection, Repository } from 'typeorm';

describe('Session Service', () => {
  let conn: Connection;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    conn = await createConnection('test');
    userRepository = conn.getRepository(User);
  });

  afterEach(async () => {
    userRepository.delete({});
  });

  it('should be not able start session with user not found', async () => {
    const sessionService = new SessionService(userRepository);

    const response = sessionService.execute({
      email: 'undefinedemail@test.com',
      password: 'pass'
    });

    await expect(response).rejects.toBeInstanceOf(AppError);
  });

  it('should be not able start session with incorrect password', async () => {
    const passHash = await hash('tom123', 8);

    const user = await userRepository.save({
      name: 'Tom',
      email: 'tom@test.com',
      password: passHash
    });

    const sessionService = new SessionService(userRepository);
    const response = sessionService.execute({
      email: user.email,
      password: 'InvalidPass'
    });

    await expect(response).rejects.toBeInstanceOf(AppError);
  });

  it('should be able start session', async () => {
    const passHash = await hash('tom123', 8);

    const user = await userRepository.save({
      name: 'Tom',
      email: 'tom@test.com',
      password: passHash
    });

    const sessionService = new SessionService(userRepository);
    const response = await sessionService.execute({
      email: user.email,
      password: 'tom123'
    });

    expect(typeof response).toBe('string');
  });
});
