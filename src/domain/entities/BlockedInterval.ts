import { Entity, type EntityOptions } from '@domain/core/Entity';
import type { Replace } from '@domain/core/Replace';

export interface BlockedIntervalProps {
  professionalId: string;
  startsAt: Date;
  endsAt: Date;
  createdBy: string;
  reason: string | null;
}

export class BlockedInterval extends Entity<BlockedIntervalProps> {
  constructor(
    props: Replace<BlockedIntervalProps, { reason?: string | null }>,
    options: EntityOptions
  ) {
    super(
      {
        professionalId: props.professionalId,
        createdBy: props.createdBy,
        startsAt: props.startsAt,
        endsAt: props.endsAt,
        reason: props.reason ?? null,
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

  get createdBy(): string {
    return this.props.createdBy;
  }
  set createdBy(value: string) {
    this.props.createdBy = value;
    this.touch();
  }

  get reason(): string | null {
    return this.props.reason;
  }
  set reason(value: string | null) {
    this.props.reason = value ?? null;
    this.touch();
  }
}
