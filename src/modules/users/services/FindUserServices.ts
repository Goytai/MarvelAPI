import { Repository } from 'typeorm';
import AppError from '@shared/errors/AppError';
import User from '../entities/User';

interface IRequest {
  user_id: number;
}

class FindUserServices {
  constructor(private userRepository: Repository<User>) {}

  public async execute({ user_id }: IRequest): Promise<User> {
    const user = await this.userRepository.findOne({
      select: ['id', 'name', 'avatar'],
      where: { id: user_id },
      relations: ['characters', 'comics']
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }
}

export default FindUserServices;
