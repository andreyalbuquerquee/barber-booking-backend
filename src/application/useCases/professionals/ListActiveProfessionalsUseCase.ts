import type { Professional } from '@domain/entities/Professional';
import type { ProfessionalRepository } from '../../ports/repositories/ProfessionalRepository';

interface Output {
  professionals: Professional[];
}

export class ListActiveProfessionalsUseCase {
  constructor(private readonly repository: ProfessionalRepository) { }

  async execute(): Promise<Output> {
    const professionals = await this.repository.listActive();

    return {
      professionals,
    };
  }
}