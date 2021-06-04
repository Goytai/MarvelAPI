import { Connection, createConnection, Repository } from 'typeorm';

import RemoveFavoriteComics from '@modules/comics/services/RemoveFavoriteComicService';
import User from '@modules/users/entities/User';

import AppError from '@shared/errors/AppError';
import Comics from '@modules/comics/entities/Comics';

describe('Remove Favorite Comic', () => {
  let conn: Connection;
  let userRepository: Repository<User>;
  let comicRepository: Repository<Comics>;

  beforeAll(async () => {
    conn = await createConnection('test');
    userRepository = conn.getRepository(User);
    comicRepository = conn.getRepository(Comics);
  });

  afterEach(async () => {
    userRepository.delete({});
  });

  it('should be not able to remove favorite from another user', async () => {
    const removeFavoriteComicService = new RemoveFavoriteComics(userRepository);

    const response = removeFavoriteComicService.execute({
      authUserId: 1,
      user_id: 2,
      marvel_id: 3
    });

    await expect(response).rejects.toBeInstanceOf(AppError);
  });

  it('should be not able to remove favorite with not inform the marvel id', async () => {
    const removeFavoriteComicService = new RemoveFavoriteComics(userRepository);

    const response = removeFavoriteComicService.execute({
      authUserId: 1,
      user_id: 1,
      marvel_id: NaN
    });

    await expect(response).rejects.toBeInstanceOf(AppError);
  });

  it('should be not able to remove favorite with user not found', async () => {
    const removeFavoriteComicService = new RemoveFavoriteComics(userRepository);

    const response = removeFavoriteComicService.execute({
      authUserId: 1,
      user_id: 1,
      marvel_id: 1
    });

    await expect(response).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to remove favorite', async () => {
    const comic = await comicRepository.save({
      marvel_id: 1,
      title: 'Comic Title',
      description: 'Description',
      picture: 'example.jpg'
    });

    const user = await userRepository.save({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: 'johndoe123',
      comics: [comic]
    });

    const removeFavoriteComicService = new RemoveFavoriteComics(userRepository);

    const response = await removeFavoriteComicService.execute({
      authUserId: user.id,
      user_id: user.id,
      marvel_id: comic.marvel_id
    });

    expect(response).toHaveProperty('id');
    expect(response).toHaveProperty('active');
    expect(response).toHaveProperty('updated_at');
    expect(response).toHaveProperty('created_at');
    expect(response.name).toBe(user.name);
    expect(response.email).toBe(user.email);
  });
});
