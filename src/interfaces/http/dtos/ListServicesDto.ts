import { z } from 'zod';

export const ListServicesQuerySchema = z.object({
  page: z.coerce.number().optional(),
  perPage: z.coerce.number().optional(),
  active: z.enum(['true', 'false']).transform((value) => value === 'true').optional(),
});

export type ListServicesDto = z.infer<typeof ListServicesQuerySchema>;