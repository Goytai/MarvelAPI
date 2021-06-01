import User from '@modules/users/entities/User';
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import FindUserServices from '@modules/users/services/FindUserServices';
import CreateUserServices from '../../services/CreateUserServices';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const createUserService = new CreateUserServices(getRepository(User));
    const user = await createUserService.execute({
      name,
      email,
      password
    });

    return response.status(201).json({
      statusCode: 201,
      user: Object.assign(user, { password: undefined })
    });
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const findUserService = new FindUserServices(getRepository(User));
    const user = await findUserService.execute({
      user_id
    });

    return response.status(200).json({ statusCode: 200, user });
  }
}
