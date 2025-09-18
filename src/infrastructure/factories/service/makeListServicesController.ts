import { ListServicesController } from '../../../interfaces/http/controllers/ListServicesController';
import type { Controller } from '../../../interfaces/http/protocols/Controller';
import { makeListServicesUseCase } from './makeListServicesUseCase';

export function makeListServicesController(): Controller {
  return new ListServicesController(makeListServicesUseCase());
}