import { z } from 'zod';

export const signInDtoSchema = z.object({
  email: z.email('Informe um e-mail válido!'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres!'),
})

export type SignInDto = z.infer<typeof signInDtoSchema>;