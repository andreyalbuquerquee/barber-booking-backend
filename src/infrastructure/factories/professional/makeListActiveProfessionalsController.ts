import { ListActiveProfessionalsController } from '../../../interfaces/http/controllers/ListActiveProfessionalsController';
import type { Controller } from '../../../interfaces/http/protocols/Controller';
import { makeListActiveProfessionalsUseCase } from './makeListActiveProfessionalsUseCase';

export function makeListActiveProfessionalsController(): Controller {
  return new ListActiveProfessionalsController(makeListActiveProfessionalsUseCase());
}