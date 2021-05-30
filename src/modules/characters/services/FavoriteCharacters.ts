import { Repository } from 'typeorm';

import User from '@modules/users/entities/User';
import Characters from '../entities/Characters';

interface IRequest {
  user_id: number;
  character: {
    marvel_id: number;
    name: string;
    description?: string;
    picture?: string;
  };
}

class FavoriteCharacters {
  constructor(
    private characterRepository: Repository<Characters>,
    private userRepository: Repository<User>
  ) {}

  public async execute({
    user_id,
    character: { marvel_id, name, description, picture }
  }: IRequest): Promise<User> {
    const checkUserRegistered = await this.userRepository.findOne({
      where: { id: user_id },
      relations: ['characters']
    });

    if (!checkUserRegistered) {
      throw new Error('User not found!');
    } else if (!marvel_id || !name) {
      throw new Error('It was not possible to favorite this character!');
    }

    const character = await this.characterRepository.save({
      marvel_id,
      name,
      description,
      picture
    });

    const insertCharacters = {
      ...checkUserRegistered,
      characters: [...checkUserRegistered.characters, character]
    };
    const addFavorite = await this.userRepository.save(insertCharacters);

    return addFavorite;
  }
}

export default FavoriteCharacters;
