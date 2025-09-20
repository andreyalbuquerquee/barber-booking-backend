import { 
  ListActiveProfessionalsUseCase 
} from '@application/useCases/professionals/ListActiveProfessionalsUseCase';
import { makeProfessionalRepository } from './makeProfessionalRepository';

export function makeListActiveProfessionalsUseCase() {
  return new ListActiveProfessionalsUseCase(makeProfessionalRepository());
}