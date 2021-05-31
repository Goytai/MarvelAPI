import { Repository } from 'typeorm';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

import AppError from '@shared/errors/AppError';
import configApp from '@config/app';
import User from '../entities/User';

interface IRequest {
  email: string;
  password: string;
}

class SessionService {
  constructor(private userRepository: Repository<User>) {}

  public async execute({ email, password }: IRequest): Promise<string> {
    const checkUserExits = await this.userRepository.findOne({ email });

    if (!checkUserExits) {
      throw new AppError('Invalid credentials', 400);
    }

    const passIsValid = await compare(password, checkUserExits.password);

    if (!passIsValid) {
      throw new AppError('Invalid credentials', 400);
    }

    const token = sign(
      {
        user_id: checkUserExits.id,
        name: checkUserExits.name
      },
      configApp.secret,
      { expiresIn: '1d' }
    );

    return token;
  }
}

export default SessionService;
