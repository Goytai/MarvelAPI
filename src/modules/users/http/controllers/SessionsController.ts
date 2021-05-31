import User from '@modules/users/entities/User';
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import SessionService from '@modules/users/services/SessionServices';

class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const sessionService = new SessionService(getRepository(User));
    const token = await sessionService.execute({ email, password });

    return response.status(200).json({ statusCode: 200, token });
  }
}

export default SessionsController;
