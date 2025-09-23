import { Entity, type EntityOptions } from '@domain/core/Entity';
import type { Replace } from '@domain/core/Replace';

export interface WorkingHoursProps {
  professionalId: string,
  weekday: number,
  startTime: string,
  endTime: string,
  slotStepMin: number,
}

export class WorkingHours extends Entity<WorkingHoursProps> {
  constructor(
    props: Replace<WorkingHoursProps, { slotStepMin?: number }>,
    options: EntityOptions
  ) {
      super(
        {
        professionalId: props.professionalId,
        weekday: props.weekday,
        slotStepMin: props.slotStepMin ?? 15,
        startTime: props.startTime,
        endTime: props.endTime,
        },
        options
      );
    }

  get professionalId(): string {
    return this.props.professionalId;
  }
  set professionalId(value: string) {
    this.props.professionalId = value;
    this.touch();
  }

  get weekday(): number {
    return this.props.weekday;
  }
  set weekday(value: number) {
    this.props.weekday = value;
    this.touch();
  }

  get startTime(): string {
    return this.props.startTime;
  }
  set startTime(value: string) {
    this.props.startTime = value;
    this.touch();
  }

  get endTime(): string {
    return this.props.endTime;
  }
  set endTime(value: string) {
    this.props.endTime = value;
    this.touch();
  }

  get slotStepMin(): number {
    return this.props.slotStepMin;
  }
  set slotStepMin(value: number) {
    this.props.slotStepMin = value;
    this.touch();
  }
}