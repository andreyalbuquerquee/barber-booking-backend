import { ListActiveProfessionalsUseCase } from '../../../application/useCases/ListActiveProfessionalsUseCase';
import { makeProfessionalRepository } from './makeProfessionalRepository';

export function makeListActiveProfessionalsUseCase() {
  return new ListActiveProfessionalsUseCase(makeProfessionalRepository());
}