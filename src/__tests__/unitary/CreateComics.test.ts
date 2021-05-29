import Comics from '@modules/comics/entities/Comics';
import CreateComicServices from '@modules/comics/services/CreateComicServices';
import { Connection, createConnection, Repository } from 'typeorm';

describe('Comics Service', () => {
  let conn: Connection;
  let comicsRepository: Repository<Comics>;

  beforeAll(async () => {
    conn = await createConnection('test');
    comicsRepository = conn.getRepository(Comics);
  });

  afterEach(async () => {
    await comicsRepository.delete({});
  });

  it('should able create a new comic', async () => {
    const createComicService = new CreateComicServices(comicsRepository);

    const comic = {
      marvel_id: 2
    };

    const response = await createComicService.execute(comic);

    expect(response).toBeInstanceOf(Comics);
  });

  it('should not able create a new comic witch marvel id already exists', async () => {
    const createComicService = new CreateComicServices(comicsRepository);

    const comic = {
      marvel_id: 2
    };

    await createComicService.execute(comic);

    expect(createComicService.execute(comic)).rejects.toThrowError(
      new Error('This comic already registered')
    );
  });
});
