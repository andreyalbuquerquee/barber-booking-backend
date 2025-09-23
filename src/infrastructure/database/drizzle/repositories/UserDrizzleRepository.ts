import type { User } from '@domain/entities/User';
import type { UserRepository } from '@application/ports/repositories/UserRepository';
import { eq } from 'drizzle-orm';
import { users } from '../migrations/schema';
import { UserMapper } from '../mappers/UserMapper';
import type { DB } from '../connection';

export class UserDrizzleRepository implements UserRepository {
  constructor(private readonly db: DB) { }

  async save(user: User): Promise<void> {
    const row = UserMapper.toDrizzleRepository(user);

    await this.db
      .insert(users)
      .values(row)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          name: row.name,
          email: row.email,
          passwordHash: row.passwordHash,
          role: row.role,
          isActive: row.isActive,
          updatedAt: row.updatedAt,
        },
      });
  }
  async findByEmail(email: string): Promise<User | undefined> {
    const [ row ] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return row ? UserMapper.toDomain(row) : undefined;
  }

}