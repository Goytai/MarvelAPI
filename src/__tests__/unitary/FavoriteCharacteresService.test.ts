import { Connection, createConnection, Repository } from 'typeorm';

import User from '@modules/users/entities/User';
import Characters from '@modules/characters/entities/Characters';

import FavoriteCharacters from '@modules/characters/services/FavoriteCharacters';
import AppError from '@shared/errors/AppError';

describe('Favorite Characters Service', () => {
  let conn: Connection;
  let charactersRepository: Repository<Characters>;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    conn = await createConnection('test');
    charactersRepository = conn.getRepository(Characters);
    userRepository = conn.getRepository(User);
  });

  afterEach(async () => {
    await userRepository.delete({});
    await charactersRepository.delete({});
  });

  it('should be not able favorite character with user not registered', async () => {
    const favoriteCharacters = new FavoriteCharacters(
      charactersRepository,
      userRepository
    );

    const response = favoriteCharacters.execute({
      user_id: -1,
      character: {
        marvel_id: 1,
        name: 'Name Example',
        description: 'Description Test',
        picture: 'image.jpg'
      }
    });

    await expect(response).rejects.toBeInstanceOf(AppError);
  });

  it('should be not able favorite character with name has undefined', async () => {
    const user = await userRepository.save({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: 'johndoe123'
    });

    const character = {
      marvel_id: 1,
      name: '',
      description: 'Description Test',
      picture: 'image.jpg'
    };

    const favoriteCharacters = new FavoriteCharacters(
      charactersRepository,
      userRepository
    );

    const response = favoriteCharacters.execute({
      user_id: user.id,
      character
    });

    await expect(response).rejects.toBeInstanceOf(AppError);
  });

  it('should be not able favorite character with marvel id has undefined', async () => {
    const user = await userRepository.save({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: 'johndoe123'
    });

    const character = {
      marvel_id: NaN,
      name: 'Name example',
      description: 'Description Test',
      picture: 'image.jpg'
    };

    const favoriteCharacters = new FavoriteCharacters(
      charactersRepository,
      userRepository
    );

    const response = favoriteCharacters.execute({
      user_id: user.id,
      character
    });

    await expect(response).rejects.toBeInstanceOf(AppError);
  });

  it('should be able favorite character', async () => {
    const user = await userRepository.save({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: 'johndoe123'
    });

    const character = {
      marvel_id: 1,
      name: 'Name Example',
      description: 'Description Test',
      picture: 'image.jpg'
    };

    const favoriteCharacters = new FavoriteCharacters(
      charactersRepository,
      userRepository
    );

    const response = await favoriteCharacters.execute({
      user_id: user.id,
      character
    });

    expect(response).toHaveProperty('id');
    expect(response).toHaveProperty('active');
    expect(response).toHaveProperty('updated_at');
    expect(response).toHaveProperty('created_at');
    expect(response.name).toBe(user.name);
    expect(response.email).toBe(user.email);

    expect(response.characters[0]).toHaveProperty('id');
    expect(response.characters[0]).toHaveProperty('updated_at');
    expect(response.characters[0]).toHaveProperty('created_at');
    expect(response.characters[0].marvel_id).toBe(character.marvel_id);
    expect(response.characters[0].name).toBe(character.name);
    expect(response.characters[0].description).toBe(character.description);
    expect(response.characters[0].picture).toBe(character.picture);
  });

  it('should be able favorite and updated character present in a database', async () => {
    const user = await userRepository.save({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: 'johndoe123'
    });

    const firstCharacter = {
      marvel_id: 1,
      name: 'Name Example',
      description: 'Description Test',
      picture: 'image.jpg'
    };

    const secondCharacter = {
      marvel_id: 1,
      name: 'Second Character Example',
      description: 'Second Character Description Test',
      picture: 'Second image.jpg'
    };

    const favoriteCharacters = new FavoriteCharacters(
      charactersRepository,
      userRepository
    );

    await favoriteCharacters.execute({
      user_id: user.id,
      character: firstCharacter
    });

    const response = await favoriteCharacters.execute({
      user_id: user.id,
      character: secondCharacter
    });

    expect(response).toHaveProperty('id');
    expect(response).toHaveProperty('active');
    expect(response).toHaveProperty('updated_at');
    expect(response).toHaveProperty('created_at');
    expect(response.name).toBe(user.name);
    expect(response.email).toBe(user.email);

    expect(response.characters[0]).toHaveProperty('id');
    expect(response.characters[0]).toHaveProperty('updated_at');
    expect(response.characters[0]).toHaveProperty('created_at');
    expect(Number(response.characters[0].marvel_id)).toBe(
      secondCharacter.marvel_id
    );
    expect(response.characters[0].name).toBe(secondCharacter.name);
    expect(response.characters[0].description).toBe(
      secondCharacter.description
    );
    expect(response.characters[0].picture).toBe(secondCharacter.picture);
  });

  it('should be able favorite character with description has undefined', async () => {
    const user = await userRepository.save({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: 'johndoe123'
    });

    const character = {
      marvel_id: 1,
      name: 'Name Example',
      description: undefined,
      picture: 'image.jpg'
    };

    const favoriteCharacters = new FavoriteCharacters(
      charactersRepository,
      userRepository
    );

    const response = await favoriteCharacters.execute({
      user_id: user.id,
      character
    });

    expect(response).toHaveProperty('id');
    expect(response).toHaveProperty('active');
    expect(response).toHaveProperty('updated_at');
    expect(response).toHaveProperty('created_at');
    expect(response.name).toBe(user.name);
    expect(response.email).toBe(user.email);

    expect(response.characters[0]).toHaveProperty('id');
    expect(response.characters[0]).toHaveProperty('updated_at');
    expect(response.characters[0]).toHaveProperty('created_at');
    expect(response.characters[0].marvel_id).toBe(character.marvel_id);
    expect(response.characters[0].name).toBe(character.name);
    expect(response.characters[0].description).toBe(null);
    expect(response.characters[0].picture).toBe(character.picture);
  });

  it('should be able favorite character with picture has undefined', async () => {
    const user = await userRepository.save({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: 'johndoe123'
    });

    const character = {
      marvel_id: 1,
      name: 'Name Example',
      description: 'Description Test',
      picture: undefined
    };

    const favoriteCharacters = new FavoriteCharacters(
      charactersRepository,
      userRepository
    );

    const response = await favoriteCharacters.execute({
      user_id: user.id,
      character
    });

    expect(response).toHaveProperty('id');
    expect(response).toHaveProperty('active');
    expect(response).toHaveProperty('updated_at');
    expect(response).toHaveProperty('created_at');
    expect(response.name).toBe(user.name);
    expect(response.email).toBe(user.email);

    expect(response.characters[0]).toHaveProperty('id');
    expect(response.characters[0]).toHaveProperty('updated_at');
    expect(response.characters[0]).toHaveProperty('created_at');
    expect(response.characters[0].marvel_id).toBe(character.marvel_id);
    expect(response.characters[0].name).toBe(character.name);
    expect(response.characters[0].description).toBe(character.description);
    expect(response.characters[0].picture).toBe(null);
  });
});
