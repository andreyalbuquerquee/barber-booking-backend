import z from 'zod';

export const GetDailyAvailabilityQuerySchema = z.object({
  professionalId: z.uuid(),
  serviceId: z.uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})

export type GetDailyAvailabilityQueryDto = 
  z.infer<typeof GetDailyAvailabilityQuerySchema>;