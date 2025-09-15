import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { UnauthorizedHttpError } from '../../application/shared/http/errors/UnauthorizedHttpError';
import type { UserRepository } from '../../domain/repositories/UserRepository';

interface IInput {
  email: string;
  password: string;
}

interface IOutput {
  accessToken: string;
}

export class SignInUseCase {
  constructor(private readonly repository: UserRepository) { }
  
  async execute({ email, password }: IInput): Promise<IOutput> {
    const account = await this.repository.findByEmail(email);

    if (!account) {
      throw new UnauthorizedHttpError('Credenciais inválidas!');
    }

    const isPasswordValid = await compare(password, account.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedHttpError('Credenciais inválidas!');
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