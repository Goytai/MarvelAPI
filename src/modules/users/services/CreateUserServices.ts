import { Repository } from 'typeorm';
import { hash } from 'bcrypt';
import AppError from '@shared/errors/AppError';
import User from '../entities/User';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  constructor(private userRepository: Repository<User>) {}

  public async execute({ name, email, password }: IRequest): Promise<User> {
    const checkEmailExits = await this.userRepository.findOne({
      where: { email }
    });

    if (checkEmailExits) {
      throw new AppError('Email address already used', 400);
    }

    const hashedPassword = await hash(password, 8);

    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword
    });

    const response = await this.userRepository.save(user);

    return response;
  }
}

export default CreateUserService;
