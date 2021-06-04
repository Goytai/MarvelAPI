import { Repository } from 'typeorm';

import User from '@modules/users/entities/User';
import AppError from '@shared/errors/AppError';

interface IRequest {
  authUserId: number;
  user_id: number;
  marvel_id: number;
}

class RemoveFavoriteCharacter {
  constructor(private userRepository: Repository<User>) {}

  public async execute({
    authUserId,
    user_id,
    marvel_id
  }: IRequest): Promise<User> {
    if (!marvel_id) {
      throw new AppError(
        'It was not possible to favorite this character!',
        400
      );
    } else if (Number(authUserId) !== Number(user_id)) {
      throw new AppError('You do not allow to remove bookmark!', 401);
    }

    const getUser = await this.userRepository.findOne({
      where: { id: authUserId },
      relations: ['characters']
    });

    if (!getUser) {
      throw new AppError('User not found!', 404);
    }

    const filterCharacters = getUser.characters.filter(
      character => Number(character.marvel_id) !== Number(marvel_id)
    );

    const updateCharacters = {
      ...getUser,
      characters: filterCharacters
    };

    const updateFavorite = await this.userRepository.save(updateCharacters);

    return updateFavorite;
  }
}

export default RemoveFavoriteCharacter;
