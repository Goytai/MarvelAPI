import { Repository } from 'typeorm';

import User from '@modules/users/entities/User';
import Comics from '../entities/Comics';

interface IRequest {
  user_id: number;
  comic: {
    marvel_id: number;
    title: string;
    description?: string;
    picture?: string;
  };
}

class FavoriteComics {
  constructor(
    private comicsRepository: Repository<Comics>,
    private userRepository: Repository<User>
  ) {}

  public async execute({
    user_id,
    comic: { marvel_id, title, description, picture }
  }: IRequest): Promise<User> {
    const checkUserRegistered = await this.userRepository.findOne({
      where: { id: user_id },
      relations: ['comics']
    });

    if (!checkUserRegistered) {
      throw new Error('User not found!');
    } else if (!marvel_id || !title) {
      throw new Error('It was not possible to favorite this comic!');
    }

    const comicExist = await this.comicsRepository.findOne({ marvel_id });

    let comic: Comics;

    if (comicExist) {
      comic = this.comicsRepository.merge(comicExist, {
        title,
        description,
        picture
      });
    } else {
      comic = this.comicsRepository.create({
        marvel_id,
        title,
        description,
        picture
      });
    }

    const comicArray = checkUserRegistered.comics.filter(
      oldComic => Number(oldComic.marvel_id) !== Number(marvel_id)
    );

    const insertComics = {
      ...checkUserRegistered,
      comics: [...comicArray, comic]
    };
    const addFavorite = await this.userRepository.save(insertComics);

    return addFavorite;
  }
}

export default FavoriteComics;
