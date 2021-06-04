import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import Comics from '@modules/comics/entities/Comics';
import User from '@modules/users/entities/User';

import FavoriteComics from '@modules/comics/services/FavoriteComicService';
import RemoveFavoriteComics from '@modules/comics/services/RemoveFavoriteComicService';

import api from '@shared/http/axios';
import AppError from '@shared/errors/AppError';

export default class ComicsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { limit, page, search } = request.query;

    const perPage = Number(limit) || 10;
    const currentPage = page ? (Number(page) - 1) * Number(perPage) : 1;

    if (perPage > 100) {
      throw new AppError('The limit cannot be greater than 100', 400);
    }

    const remote = await api.get('comics', {
      params: {
        limit: limit || 10,
        offset: currentPage,
        titleStartsWith: search
      }
    });

    const remoteComics = remote.data.data.results;
    const comicsArray: any[] = [];

    remoteComics.forEach((comic: any) => {
      comicsArray.push({
        marvel_id: comic.id,
        title: comic.title,
        description: comic.description,
        picture: `${comic.thumbnail.path}.${comic.thumbnail.extension}`
      });
    });

    const result = {
      statusCode: 200,
      page: currentPage,
      limit: perPage,
      comics: comicsArray
    };

    return response.status(200).json(result);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { marvel_id } = request.params;

    const remote = await api.get(`comics/${marvel_id}`);

    const remoteComic = remote.data.data.results;
    const comicsArray: any[] = [];

    remoteComic.forEach((comic: any) => {
      comicsArray.push({
        marvel_id: comic.id,
        title: comic.title,
        description: comic.description,
        picture: `${comic.thumbnail.path}.${comic.thumbnail.extension}`
      });
    });

    const result = {
      statusCode: 200,
      comics: comicsArray
    };

    return response.status(200).json(result);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const {
      comic: { marvel_id, title, description, picture }
    } = request.body;

    const favoriteComics = new FavoriteComics(
      getRepository(Comics),
      getRepository(User)
    );

    await favoriteComics.execute({
      user_id,
      comic: { marvel_id, title, description, picture }
    });

    return response.status(201).json({ statusCode: 201 });
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const authUserId = request.user.id;

    const { user_id, marvel_id } = request.body;

    const remoteFavoriteComics = new RemoveFavoriteComics(getRepository(User));

    await remoteFavoriteComics.execute({ authUserId, user_id, marvel_id });

    return response.status(200).json({ statusCode: 200 });
  }
}
