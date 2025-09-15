import type { User } from '../entities/User';

export abstract class UserRepository {
  abstract save(user: User): Promise<void>;
  abstract findByEmail(email: string): Promise<User | undefined>;
}