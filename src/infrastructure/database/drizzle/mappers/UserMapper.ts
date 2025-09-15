import { users } from '../../../../../drizzle/schema';
import { User } from '../../../../domain/entities/User';
import type { RoleCode } from '../../../../domain/entities/Role';

export type UserRowInsert = typeof users.$inferInsert;
export type UserRowSelect = typeof users.$inferSelect;
type DbRole = NonNullable<UserRowInsert["role"]>;

export const UserMapper = {
  toDrizzleRepository(u: User): UserRowInsert {
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      passwordHash: u.passwordHash,
      role: u.role.toLowerCase() as DbRole,
      isActive: u.isActive,
      createdAt: u.createdAt.toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  toDomain(row: UserRowSelect): User {
    return new User({
      id: row.id,
      name: row.name,
      email: row.email,
      passwordHash: row.passwordHash,
      role: row.role as RoleCode,
      isActive: row.isActive,
      createdAt: row.createdAt ? new Date(row.createdAt) : undefined,
      updatedAt: row.updatedAt ? new Date(row.updatedAt) : undefined,
    });
  },
};
