import api from '@shared/http/axios';
import { Request, Response } from 'express';

import AppError from '@shared/errors/AppError';

export default class SearchController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { search } = request.query;

    if (!search) {
      throw new AppError('Please send a search query', 400);
    }

    const charactersRequest = api.get('characters', {
      params: {
        nameStartsWith: search,
        limit: 10
      }
    });

    const comicsRequest = api.get('comics', {
      params: {
        titleStartsWith: search,
        limit: 10
      }
    });

    const remote = await Promise.all([charactersRequest, comicsRequest]);

    const remoteCharacters = remote[0].data.data.results;
    const remoteComics = remote[1].data.data.results;

    const charactersArray: any[] = [];
    const comicArray: any[] = [];

    remoteCharacters.forEach((character: any) => {
      charactersArray.push({
        marvel_id: character.id,
        name: character.name,
        description: character.description,
        picture: `${character.thumbnail.path}.${character.thumbnail.extension}`
      });
    });

    remoteComics.forEach((comic: any) => {
      comicArray.push({
        marvel_id: comic.id,
        name: comic.name,
        description: comic.description,
        picture: `${comic.thumbnail.path}.${comic.thumbnail.extension}`
      });
    });

    const result = {
      statusCode: 200,
      comics: comicArray,
      characters: charactersArray
    };

    return response.status(200).json(result);
  }
}
