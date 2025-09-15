import { SignInController } from '../../../application/controllers/SignInController';
import type { Controller } from '../../../application/shared/http/interfaces/Controller';
import { makeSignInUseCase } from './makeSignInUseCase';

export function makeSignInController(): Controller {
  return new SignInController(makeSignInUseCase());
}