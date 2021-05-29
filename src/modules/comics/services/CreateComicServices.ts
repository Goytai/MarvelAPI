import api from '@shared/http/axios';
import { Repository } from 'typeorm';
import Comics from '../entities/Comics';

interface IRequest {
  marvel_id: number;
}

class CreateComicService {
  constructor(private comicRepository: Repository<Comics>) {}

  public async execute({ marvel_id }: IRequest): Promise<Comics> {
    const checkComicExist = await this.comicRepository.findOne({ marvel_id });

    if (checkComicExist) {
      throw new Error('This comic already registered');
    }

    const remote = await api.get(`comics/${marvel_id}`);

    const data = remote.data.data.results[0];

    const comic = this.comicRepository.create({
      marvel_id: data.id,
      title: data.title,
      description: data.description,
      picture: `${data.thumbnail.path}.${data.thumbnail.extension}`
    });

    const response = await this.comicRepository.save(comic);

    return response;
  }
}

export default CreateComicService;
