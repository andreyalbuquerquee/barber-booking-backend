import { ListServicesUseCase } from '../../../application/useCases/ListServicesUseCase';
import { makeServiceRepository } from './makeServiceRepository';

export function makeListServicesUseCase() {
  return new ListServicesUseCase(makeServiceRepository());
}