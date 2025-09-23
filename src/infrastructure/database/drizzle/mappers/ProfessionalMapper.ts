import type { professionals } from '../migrations/schema';
import { Professional } from '@domain/entities/Professional';

export type ProfessionalRowSelect = typeof professionals.$inferSelect;

export const ProfessionalMapper = {
  toDomain(row: ProfessionalRowSelect): Professional {
    return new Professional({
      fullName: row.fullName,
      userId: row.userId,
      bio: row.bio,
      phone: row.phone,
      slug: row.slug,
      active: row.active,
      timezone: row.timezone,
    }, {
      id: row.id,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    });
  } 
} 