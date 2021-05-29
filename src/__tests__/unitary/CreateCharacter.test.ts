import Charapters from '@modules/characters/entities/Characters';
import CreateCharacterService from '@modules/characters/services/CreateCharacterServices';
import { Connection, createConnection, Repository } from 'typeorm';

describe('Character Service', () => {
  let conn: Connection;
  let characterRepository: Repository<Charapters>;

  beforeAll(async () => {
    conn = await createConnection('test');
    characterRepository = conn.getRepository(Charapters);
  });

  afterEach(async () => {
    await characterRepository.delete({});
  });

  it('should able create a new character', async () => {
    const createCharacterService = new CreateCharacterService(
      characterRepository
    );

    const character = {
      marvel_id: 1011334
    };

    const response = await createCharacterService.execute(character);

    expect(response).toBeInstanceOf(Charapters);
  });

  it('should not able create a new character witch marvel id already exists', async () => {
    const createCharacterService = new CreateCharacterService(
      characterRepository
    );

    const character = {
      marvel_id: 1011334
    };

    await createCharacterService.execute(character);

    expect(createCharacterService.execute(character)).rejects.toThrowError(
      new Error('This character already registered')
    );
  });
});
