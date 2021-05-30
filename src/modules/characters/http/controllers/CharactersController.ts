import api from '@shared/http/axios';
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import User from '@modules/users/entities/User';
import Characters from '@modules/characters/entities/Characters';

import FavoriteCharacters from '@modules/characters/services/FavoriteCharacters';
import AppError from '@shared/errors/AppError';

export default class CharactersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { limit, page } = request.query;

    const perPage = Number(limit) || 10;
    const currentPage = page ? (Number(page) - 1) * Number(perPage) : 1;

    if (perPage > 100) {
      throw new AppError('The limit cannot be greater than 100', 400);
    }

    const remote = await api.get('characters', {
      params: {
        limit: limit || 10,
        offset: currentPage
      }
    });

    const remoteCharacters = remote.data.data.results;
    const charactersArray: any[] = [];

    remoteCharacters.forEach((comic: any) => {
      charactersArray.push({
        marvel_id: comic.id,
        name: comic.name,
        description: comic.description,
        picture: `${comic.thumbnail.path}.${comic.thumbnail.extension}`
      });
    });

    const result = {
      statusCode: 200,
      page: currentPage,
      limit: perPage,
      comics: charactersArray
    };

    return response.status(200).json(result);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { marvel_id } = request.params;

    const remote = await api.get(`characters/${marvel_id}`);

    const remoteCharacter = remote.data.data.results;
    const charactersArray: any[] = [];

    remoteCharacter.forEach((comic: any) => {
      charactersArray.push({
        marvel_id: comic.id,
        name: comic.name,
        description: comic.description,
        picture: `${comic.thumbnail.path}.${comic.thumbnail.extension}`
      });
    });

    const result = {
      statusCode: 200,
      comics: charactersArray
    };

    return response.status(200).json(result);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const {
      user_id,
      character: { marvel_id, name, description, picture }
    } = request.body;

    const favoriteCharacters = new FavoriteCharacters(
      getRepository(Characters),
      getRepository(User)
    );

    await favoriteCharacters.execute({
      user_id,
      character: { marvel_id, name, description, picture }
    });

    return response.status(201).json({ statusCode: 201 });
  }
}
