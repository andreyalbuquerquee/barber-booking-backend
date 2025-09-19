import type { Professional } from '../entities/Professional';

export abstract class ProfessionalRepository {
  abstract listActive(): Promise<Professional[]>;
}