import { Repository } from 'typeorm';

import User from '@modules/users/entities/User';
import AppError from '@shared/errors/AppError';
import Comics from '../entities/Comics';

interface IRequest {
  authUserId: number;
  user_id: number;
  marvel_id: number;
}

class RemoveFavoriteComics {
  constructor(private userRepository: Repository<User>) {}

  public async execute({
    authUserId,
    user_id,
    marvel_id
  }: IRequest): Promise<User> {
    if (!marvel_id) {
      throw new AppError('It was not possible to favorite this comic!', 400);
    } else if (Number(authUserId) !== Number(user_id)) {
      throw new AppError('You do not allow to remove bookmark!', 401);
    }

    const getUser = await this.userRepository.findOne({
      where: { id: authUserId },
      relations: ['comics']
    });

    if (!getUser) {
      throw new AppError('User not found!', 404);
    }

    const filterComics = getUser.comics.filter(
      comic => Number(comic.marvel_id) !== Number(marvel_id)
    );

    const updateComics = {
      ...getUser,
      comics: filterComics
    };

    const updateFavorite = await this.userRepository.save(updateComics);

    return updateFavorite;
  }
}

export default RemoveFavoriteComics;
