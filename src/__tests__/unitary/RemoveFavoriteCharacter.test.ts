import { Connection, createConnection, Repository } from 'typeorm';

import RemoveFavoriteCharacterService from '@modules/characters/services/RemoveFavoriteCharacterService';
import User from '@modules/users/entities/User';

import AppError from '@shared/errors/AppError';
import Characters from '@modules/characters/entities/Characters';

describe('Remove Favorite Comic', () => {
  let conn: Connection;
  let userRepository: Repository<User>;
  let characterRepository: Repository<Characters>;

  beforeAll(async () => {
    conn = await createConnection('test');
    userRepository = conn.getRepository(User);
    characterRepository = conn.getRepository(Characters);
  });

  afterEach(async () => {
    userRepository.delete({});
  });

  it('should be not able to remove favorite from another user', async () => {
    const removeFavoriteCharacterService = new RemoveFavoriteCharacterService(
      userRepository
    );

    const response = removeFavoriteCharacterService.execute({
      authUserId: 1,
      user_id: 2,
      marvel_id: 3
    });

    await expect(response).rejects.toBeInstanceOf(AppError);
  });

  it('should be not able to remove favorite with not inform the marvel id', async () => {
    const removeFavoriteCharacterService = new RemoveFavoriteCharacterService(
      userRepository
    );

    const response = removeFavoriteCharacterService.execute({
      authUserId: 1,
      user_id: 1,
      marvel_id: NaN
    });

    await expect(response).rejects.toBeInstanceOf(AppError);
  });

  it('should be not able to remove favorite with user not found', async () => {
    const removeFavoriteCharacterService = new RemoveFavoriteCharacterService(
      userRepository
    );

    const response = removeFavoriteCharacterService.execute({
      authUserId: 1,
      user_id: 1,
      marvel_id: 1
    });

    await expect(response).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to remove favorite', async () => {
    const character = await characterRepository.save({
      marvel_id: 1,
      name: 'Name Character',
      description: 'Description',
      picture: 'example.jpg'
    });

    const user = await userRepository.save({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: 'johndoe123',
      characters: [character]
    });

    const removeFavoriteCharacterService = new RemoveFavoriteCharacterService(
      userRepository
    );

    const response = await removeFavoriteCharacterService.execute({
      authUserId: user.id,
      user_id: user.id,
      marvel_id: character.marvel_id
    });

    expect(response).toHaveProperty('id');
    expect(response).toHaveProperty('active');
    expect(response).toHaveProperty('updated_at');
    expect(response).toHaveProperty('created_at');
    expect(response.name).toBe(user.name);
    expect(response.email).toBe(user.email);
  });
});
