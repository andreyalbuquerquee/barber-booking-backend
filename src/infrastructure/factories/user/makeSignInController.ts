import { SignInController } from '../../../interfaces/http/controllers/SignInController';
import type { Controller } from '../../../interfaces/http/protocols/Controller';
import { makeSignInUseCase } from './makeSignInUseCase';

export function makeSignInController(): Controller {
  return new SignInController(makeSignInUseCase());
}