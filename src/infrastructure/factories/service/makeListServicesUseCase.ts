import { ListServicesUseCase } from '@application/useCases/services/ListServicesUseCase';
import { makeServiceRepository } from './makeServiceRepository';

export function makeListServicesUseCase() {
  return new ListServicesUseCase(makeServiceRepository());
}