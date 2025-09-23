import type { BlockedInterval } from '@domain/entities/BlockedInterval';

export interface BlockedIntervalRepository {
  findOverlappingLocalMinutes(
    professionalId: string,
    dateISO: string
  ): Promise<BlockedInterval[]>;
}