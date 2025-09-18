import { z } from 'zod';

export const signInDtoSchema = z.object({
  email: z.email().min(1),
  password: z.string().min(8),
})

export type SignInDto = z.infer<typeof signInDtoSchema>;