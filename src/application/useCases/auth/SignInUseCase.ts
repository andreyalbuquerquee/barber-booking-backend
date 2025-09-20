import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../../../config/env';
import type {
  UserRepository
} from '@application/ports/repositories/UserRepository';
import { UnauthorizedError } from '@application/errors/UnauthorizedError';

interface Input {
  email: string;
  password: string;
}

interface Output {
  accessToken: string;
}

export class SignInUseCase {
  constructor(private readonly repository: UserRepository) { }
  
  async execute({ email, password }: Input): Promise<Output> {
    const account = await this.repository.findByEmail(email);

    if (!account) {
      throw new UnauthorizedError('Credenciais inválidas!');
    }

    const isPasswordValid = await compare(password, account.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Credenciais inválidas!');
    }

    const accessToken = jwt.sign(
      {
        sub: account.id,
        role: account.role,
      },
      env.JWT_SECRET,
      { expiresIn: '1d' },
    );

    return {
      accessToken,
    };
  }
}