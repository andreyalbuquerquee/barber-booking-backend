import type { BlockedIntervalRepository } from '@application/ports/repositories/BlockedIntervalRepository';
import type { BlockedInterval } from '@domain/entities/BlockedInterval';
import type { DB } from '../connection';
import { blockedIntervals } from '../migrations/schema';
import { and, eq, sql } from 'drizzle-orm';
import { BlockedIntervalMapper } from '../mappers/BlockedIntervalMapper';

export class BlockedIntervalDrizzleRepository implements BlockedIntervalRepository {
  constructor(private readonly db: DB) {}

  async findOverlappingLocalMinutes(
    professionalId: string,
    dateISO: string
  ): Promise<BlockedInterval[]> {
    const dayStartLocal = sql`(${dateISO}::date)::timestamp`;
    const dayEndLocal   = sql`((${dateISO}::date + INTERVAL '1 day')::timestamp)`; 

    const startsLocal = sql`(${blockedIntervals.startsAt} AT TIME ZONE 'America/Recife')`;
    const endsLocal   = sql`(${blockedIntervals.endsAt}   AT TIME ZONE 'America/Recife')`;

    const overlapPredicate = and(
      sql`${startsLocal} < ${dayEndLocal}`,
      sql`${endsLocal}   > ${dayStartLocal}`
    );

    const rows = await this.db
      .select()
      .from(blockedIntervals)
      .where(
        and(
          eq(blockedIntervals.professionalId, professionalId),
          overlapPredicate
        )
      );

    return rows.map(BlockedIntervalMapper.toDomain);
  }
}
