import type { 
  AppointmentRepository
} from '@application/ports/repositories/AppointmentRepository';
import type {
  BlockedIntervalRepository
} from '@application/ports/repositories/BlockedIntervalRepository';
import type {
  ProfessionalRepository
} from '@application/ports/repositories/ProfessionalRepository';
import type {
  ServiceRepository } from '@application/ports/repositories/ServiceRepository';
import type {
  WorkingHourRepository
} from '@application/ports/repositories/WorkingHourRepository';
import { overlapsAnyMin } from '../../shared/utils/interval';
import { minutesToHHmm, getWeekday, timeStringToMinutes } from '@application/shared/utils/time';
import { NotFoundError } from '@application/errors/NotFoundError';

interface Input {
  professionalId: string;
  serviceId: string;
  date: string;
}

interface Slot {
  start: string;
  end: string;
}

interface Output {
  slots: Slot[];
}

export class GetDailyAvailabilityUseCase {
  constructor(
    private readonly professionalRepo: ProfessionalRepository,
    private readonly serviceRepo: ServiceRepository,
    private readonly workingHoursRepo: WorkingHourRepository,
    private readonly blockedIntervalRepo: BlockedIntervalRepository,
    private readonly appointmentsRepo: AppointmentRepository,
  ) { }

  async execute({ professionalId, serviceId, date }: Input): Promise<Output> {
    const [professional, service] = await Promise.all([
      this.professionalRepo.findById(professionalId),
      this.serviceRepo.findById(serviceId),
    ]);

    if (!professional) {
      throw new NotFoundError('Profissional não encontrado!')
    };

    if (!service || !service.active) {
      throw new NotFoundError('Serviço não encontrado!')
    };

    const weekday = getWeekday(date);
    const wh = await this.workingHoursRepo.findByProfessionalAndWeekday(professionalId, weekday);
    
    if (!wh) return { slots: [] };

    const dayStartMin = timeStringToMinutes(wh.startTime);
    const dayEndMin   = timeStringToMinutes(wh.endTime);
    const step = wh.slotStepMin;
    const durMin = service.durationMinutes;

    const [blockedList, apptList] = await Promise.all([
      this.blockedIntervalRepo.findOverlappingLocalMinutes(professionalId, date),
      this.appointmentsRepo.findOverlappingLocalMinutes(professionalId, date, ['pending', 'confirmed']),
    ]);

    const blocked = blockedList.map(b => ({
      startMin: timeStringToMinutes(b.startsAt.toISOString()),
      endMin: timeStringToMinutes(b.endsAt.toISOString()),
    }));
    const appts = apptList.map(a => ({
      startMin: timeStringToMinutes(a.startsAt.toISOString()),
      endMin: timeStringToMinutes(a.endsAt.toISOString()),
    }));

    const slots: Slot[] = [];
    
    for (let start = dayStartMin; start < dayEndMin; start += step) {
      const end = start + durMin;
      if (end > dayEndMin) break;

      if (overlapsAnyMin({ startMin: start, endMin: end }, blocked)) continue;
      if (overlapsAnyMin({ startMin: start, endMin: end }, appts)) continue;

      slots.push({ start: minutesToHHmm(start), end: minutesToHHmm(end) });
    }

    return { slots };
  }
}
