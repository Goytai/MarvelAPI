import api from '@shared/http/axios';
import { Repository } from 'typeorm';
import Characters from '../entities/Characters';

interface IRequest {
  marvel_id: number;
}

class CreateCharacterService {
  constructor(private characterRepository: Repository<Characters>) {}

  public async execute({ marvel_id }: IRequest): Promise<Characters> {
    const checkCharacterExists = await this.characterRepository.findOne({
      marvel_id
    });

    if (checkCharacterExists) {
      throw new Error('This character already registered');
    }

    const remote = await api.get(`characters/${marvel_id}`);
    const data = remote.data.data.results[0];

    const character = this.characterRepository.create({
      marvel_id: data.id,
      name: data.name,
      description: data.description,
      picture: `${data.thumbnail.path}.${data.thumbnail.extension}`
    });

    const response = await this.characterRepository.save(character);

    return response;
  }
}

export default CreateCharacterService;
