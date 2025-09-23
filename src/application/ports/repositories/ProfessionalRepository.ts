import type { Professional } from '@domain/entities/Professional';

export abstract class ProfessionalRepository {
  abstract listActive(): Promise<Professional[]>;
  abstract findById(id: string): Promise<Professional | null>;
}