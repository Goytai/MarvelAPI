import { Connection, createConnection, Repository } from 'typeorm';

import Comics from '@modules/comics/entities/Comics';
import User from '@modules/users/entities/User';

import FavoriteComics from '@modules/comics/services/FavoriteComicService';
import AppError from '@shared/errors/AppError';

describe('Favorite Comics Service', () => {
  let conn: Connection;
  let comicsRepository: Repository<Comics>;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    conn = await createConnection('test');
    comicsRepository = conn.getRepository(Comics);
    userRepository = conn.getRepository(User);
  });

  afterEach(async () => {
    await comicsRepository.delete({});
    await userRepository.delete({});
  });

  it('should be not able favorite comic with user not registered', async () => {
    const favoriteComics = new FavoriteComics(comicsRepository, userRepository);

    const response = favoriteComics.execute({
      user_id: -1,
      comic: {
        marvel_id: 1,
        title: 'Title Example',
        description: 'Description Test',
        picture: 'image.jpg'
      }
    });

    await expect(response).rejects.toBeInstanceOf(AppError);
  });

  it('should be not able favorite comic with name has undefined', async () => {
    const user = await userRepository.save({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: 'johndoe123'
    });

    const comic = {
      marvel_id: 1,
      title: '',
      description: 'Description Test',
      picture: 'image.jpg'
    };

    const favoriteComics = new FavoriteComics(comicsRepository, userRepository);

    const response = favoriteComics.execute({
      user_id: user.id,
      comic
    });

    await expect(response).rejects.toBeInstanceOf(AppError);
  });

  it('should be not able favorite comic with marvel id has undefined', async () => {
    const user = await userRepository.save({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: 'johndoe123'
    });

    const comic = {
      marvel_id: NaN,
      title: 'Title example',
      description: 'Description Test',
      picture: 'image.jpg'
    };

    const favoriteComics = new FavoriteComics(comicsRepository, userRepository);

    const response = favoriteComics.execute({
      user_id: user.id,
      comic
    });

    await expect(response).rejects.toBeInstanceOf(AppError);
  });

  it('should be able favorite comic', async () => {
    const user = await userRepository.save({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: 'johndoe123'
    });

    const comic = {
      marvel_id: 1,
      title: 'Title Example',
      description: 'Description Test',
      picture: 'image.jpg'
    };

    const favoriteComics = new FavoriteComics(comicsRepository, userRepository);

    const response = await favoriteComics.execute({
      user_id: user.id,
      comic
    });

    expect(response).toHaveProperty('id');
    expect(response).toHaveProperty('active');
    expect(response).toHaveProperty('updated_at');
    expect(response).toHaveProperty('created_at');
    expect(response.name).toBe(user.name);
    expect(response.email).toBe(user.email);

    expect(response.comics[0]).toHaveProperty('id');
    expect(response.comics[0]).toHaveProperty('updated_at');
    expect(response.comics[0]).toHaveProperty('created_at');
    expect(response.comics[0].marvel_id).toBe(comic.marvel_id);
    expect(response.comics[0].title).toBe(comic.title);
    expect(response.comics[0].description).toBe(comic.description);
    expect(response.comics[0].picture).toBe(comic.picture);
  });

  it('should be able favorite and updated comic present in a database', async () => {
    const user = await userRepository.save({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: 'johndoe123'
    });

    const firstComic = {
      marvel_id: 1,
      title: 'Title Example',
      description: 'Description Test',
      picture: 'image.jpg'
    };

    const secondComic = {
      marvel_id: 1,
      title: 'Second Title Example',
      description: 'Second Comic Description Test',
      picture: 'Second image.jpg'
    };

    const favoriteComics = new FavoriteComics(comicsRepository, userRepository);

    await favoriteComics.execute({
      user_id: user.id,
      comic: firstComic
    });

    const response = await favoriteComics.execute({
      user_id: user.id,
      comic: secondComic
    });

    expect(response).toHaveProperty('id');
    expect(response).toHaveProperty('active');
    expect(response).toHaveProperty('updated_at');
    expect(response).toHaveProperty('created_at');
    expect(response.name).toBe(user.name);
    expect(response.email).toBe(user.email);

    expect(response.comics[0]).toHaveProperty('id');
    expect(response.comics[0]).toHaveProperty('updated_at');
    expect(response.comics[0]).toHaveProperty('created_at');
    expect(Number(response.comics[0].marvel_id)).toBe(secondComic.marvel_id);
    expect(response.comics[0].title).toBe(secondComic.title);
    expect(response.comics[0].description).toBe(secondComic.description);
    expect(response.comics[0].picture).toBe(secondComic.picture);
  });

  it('should be able favorite comic with description has undefined', async () => {
    const user = await userRepository.save({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: 'johndoe123'
    });

    const comic = {
      marvel_id: 1,
      title: 'Title Example',
      description: undefined,
      picture: 'image.jpg'
    };

    const favoriteComics = new FavoriteComics(comicsRepository, userRepository);

    const response = await favoriteComics.execute({
      user_id: user.id,
      comic
    });

    expect(response).toHaveProperty('id');
    expect(response).toHaveProperty('active');
    expect(response).toHaveProperty('updated_at');
    expect(response).toHaveProperty('created_at');
    expect(response.name).toBe(user.name);
    expect(response.email).toBe(user.email);

    expect(response.comics[0]).toHaveProperty('id');
    expect(response.comics[0]).toHaveProperty('updated_at');
    expect(response.comics[0]).toHaveProperty('created_at');
    expect(response.comics[0].marvel_id).toBe(comic.marvel_id);
    expect(response.comics[0].title).toBe(comic.title);
    expect(response.comics[0].description).toBe(null);
    expect(response.comics[0].picture).toBe(comic.picture);
  });

  it('should be able favorite comic with picture has undefined', async () => {
    const user = await userRepository.save({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: 'johndoe123'
    });

    const comic = {
      marvel_id: 1,
      title: 'Title Example',
      description: 'Description Test',
      picture: undefined
    };

    const favoriteComics = new FavoriteComics(comicsRepository, userRepository);

    const response = await favoriteComics.execute({
      user_id: user.id,
      comic
    });

    expect(response).toHaveProperty('id');
    expect(response).toHaveProperty('active');
    expect(response).toHaveProperty('updated_at');
    expect(response).toHaveProperty('created_at');
    expect(response.name).toBe(user.name);
    expect(response.email).toBe(user.email);

    expect(response.comics[0]).toHaveProperty('id');
    expect(response.comics[0]).toHaveProperty('updated_at');
    expect(response.comics[0]).toHaveProperty('created_at');
    expect(response.comics[0].marvel_id).toBe(comic.marvel_id);
    expect(response.comics[0].title).toBe(comic.title);
    expect(response.comics[0].description).toBe(comic.description);
    expect(response.comics[0].picture).toBe(null);
  });
});
