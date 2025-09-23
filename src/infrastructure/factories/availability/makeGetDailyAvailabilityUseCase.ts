import { GetDailyAvailabilityUseCase } from '@application/useCases/availability/GetDailyAvailiabilityUseCase';
import { makeServiceRepository } from '../service/makeServiceRepository';
import { makeProfessionalRepository } from '../professional/makeProfessionalRepository';
import { makeWorkingHourRepository } from './repositories/makeWorkingHourRepository';
import { makeBlockedIntervalRepository } from './repositories/makeBlockedIntervalRepository';
import { makeAppointmentRepository } from './repositories/makeAppointmentRepository';

export function makeGetDailyAvailabilityUseCase() {
  const professionalRepository = makeProfessionalRepository();
  const serviceRepository = makeServiceRepository();
  const workingHourRepository = makeWorkingHourRepository();
  const blockedIntervalRepository = makeBlockedIntervalRepository();
  const appointmentRepository = makeAppointmentRepository();
  
  return new GetDailyAvailabilityUseCase(
    professionalRepository,
    serviceRepository,
    workingHourRepository,
    blockedIntervalRepository,
    appointmentRepository,
  );
}