import { SignInUseCase } from "../../../application/useCases/SignInUseCase";
import { makeUserRepository } from './makeUserRepository';

export function makeSignInUseCase() {
  return new SignInUseCase(makeUserRepository());
}