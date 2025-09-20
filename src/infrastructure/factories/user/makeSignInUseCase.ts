import { SignInUseCase } from "@application/useCases/auth/SignInUseCase";
import { makeUserRepository } from './makeUserRepository';

export function makeSignInUseCase() {
  return new SignInUseCase(makeUserRepository());
}