import api from '@shared/http/axios';
import { Request, Response } from 'express';

export default class ComicsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { limit, page } = request.query;

    const perPage = Number(limit) || 10;
    const currentPage = page ? (Number(page) - 1) * Number(perPage) : 1;

    if (perPage > 100) {
      throw new Error('The limit cannot be greater than 100');
    }

    const remote = await api.get('comics', {
      params: {
        limit: limit || 10,
        offset: currentPage
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
      comics: comicsArray
    };

    return response.status(200).json(result);
  }
}
