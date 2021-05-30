import { Repository } from 'typeorm';

import User from '@modules/users/entities/User';
import AppError from '@shared/errors/AppError';
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
      throw new AppError('User not found!', 404);
    } else if (!marvel_id || !name) {
      throw new AppError(
        'It was not possible to favorite this character!',
        400
      );
    }

    const characterExist = await this.characterRepository.findOne({
      marvel_id
    });

    let character: Characters;

    if (characterExist) {
      character = this.characterRepository.merge(characterExist, {
        name,
        description,
        picture
      });
    } else {
      character = this.characterRepository.create({
        marvel_id,
        name,
        description,
        picture
      });
    }

    const characterArray = checkUserRegistered.characters.filter(
      oldCharacter => Number(oldCharacter.marvel_id) !== Number(marvel_id)
    );

    const insertCharacters = {
      ...checkUserRegistered,
      characters: [...characterArray, character]
    };
    const addFavorite = await this.userRepository.save(insertCharacters);

    return addFavorite;
  }
}

export default FavoriteCharacters;
