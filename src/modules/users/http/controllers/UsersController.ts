import User from '@modules/users/entities/User';
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import CreateUserService from '../../services/CreateUserServices';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const userServices = new CreateUserService(getRepository(User));
    const user = await userServices.execute({
      name,
      email,
      password
    });

    return response
      .status(201)
      .json(Object.assign(user, { password: undefined }));
  }
}
