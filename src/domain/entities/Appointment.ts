import { Entity, type EntityOptions } from '@domain/core/Entity';
import type { Replace } from '@domain/core/Replace';

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface AppointmentProps {
  professionalId: string;
  serviceId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  notes: string | null;
  status: AppointmentStatus;
  startsAt: Date;
  endsAt: Date;
  source: string;
  createdBy: string | null;
  updatedBy: string | null;
}

export class Appointment extends Entity<AppointmentProps> {
  constructor(
    props: Replace<
      AppointmentProps,
      {
        customerEmail?: string | null;
        notes?: string | null;
        status?: AppointmentStatus;
        source?: string;
        createdBy?: string | null;
        updatedBy?: string | null;
      }
    >,
    options: EntityOptions
  ) {
    super(
      {
        professionalId: props.professionalId,
        serviceId: props.serviceId,
        customerName: props.customerName,
        customerPhone: props.customerPhone,
        customerEmail: props.customerEmail ?? null,
        notes: props.notes ?? null,
        status: props.status ?? 'pending',
        startsAt: props.startsAt,
        endsAt: props.endsAt,
        source: props.source ?? 'web',
        createdBy: props.createdBy ?? null,
        updatedBy: props.updatedBy ?? null,
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

  get serviceId(): string {
    return this.props.serviceId;
  }
  set serviceId(value: string) {
    this.props.serviceId = value;
    this.touch();
  }

  get customerName(): string {
    return this.props.customerName;
  }
  set customerName(value: string) {
    this.props.customerName = value;
    this.touch();
  }

  get customerPhone(): string {
    return this.props.customerPhone;
  }
  set customerPhone(value: string) {
    this.props.customerPhone = value;
    this.touch();
  }

  get customerEmail(): string | null {
    return this.props.customerEmail;
  }
  set customerEmail(value: string | null) {
    this.props.customerEmail = value ?? null;
    this.touch();
  }

  get notes(): string | null {
    return this.props.notes;
  }
  set notes(value: string | null) {
    this.props.notes = value ?? null;
    this.touch();
  }

  get status(): AppointmentStatus {
    return this.props.status;
  }
  set status(value: AppointmentStatus) {
    this.props.status = value;
    this.touch();
  }

  get startsAt(): Date {
    return this.props.startsAt;
  }
  set startsAt(value: Date) {
    this.props.startsAt = value;
    this.touch();
  }

  get endsAt(): Date {
    return this.props.endsAt;
  }
  set endsAt(value: Date) {
    this.props.endsAt = value;
    this.touch();
  }

  get source(): string {
    return this.props.source;
  }
  set source(value: string) {
    this.props.source = value;
    this.touch();
  }

  get createdBy(): string | null {
    return this.props.createdBy;
  }
  set createdBy(value: string | null) {
    this.props.createdBy = value ?? null;
    this.touch();
  }

  get updatedBy(): string | null {
    return this.props.updatedBy;
  }
  set updatedBy(value: string | null) {
    this.props.updatedBy = value ?? null;
    this.touch();
  }

  confirm(byUserId?: string) {
    this.props.status = 'confirmed';
    if (byUserId) this.props.updatedBy = byUserId;
    this.touch();
  }

  cancel(byUserId?: string, note?: string | null) {
    this.props.status = 'cancelled';
    if (note !== undefined) this.props.notes = note;
    if (byUserId) this.props.updatedBy = byUserId;
    this.touch();
  }

  complete(byUserId?: string) {
    this.props.status = 'completed';
    if (byUserId) this.props.updatedBy = byUserId;
    this.touch();
  }

  reschedule(newStartsAt: Date, newEndsAt: Date, byUserId?: string) {
    this.props.startsAt = newStartsAt;
    this.props.endsAt = newEndsAt;
    if (byUserId) this.props.updatedBy = byUserId;
    this.touch();
  }
}
