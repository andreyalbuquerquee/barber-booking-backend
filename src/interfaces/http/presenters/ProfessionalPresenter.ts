import type { Professional } from '../../../domain/entities/Professional';

export type ProfessionalDTO = {
  id: string;
  fullName: string;
  phone: string;
  bio: string;
};

export class ProfessionalPresenter {
  static toHTTP(p: Professional): ProfessionalDTO {
    return {
      id: p.id,
      fullName: p.fullName,
      phone: p.phone,
      bio: p.bio,
    };
  }
}
