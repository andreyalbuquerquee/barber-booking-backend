import type { User } from '@domain/entities/User';

export abstract class UserRepository {
  abstract save(user: User): Promise<void>;
  abstract findByEmail(email: string): Promise<User | undefined>;
}