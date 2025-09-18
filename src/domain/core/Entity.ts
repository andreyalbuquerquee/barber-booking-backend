import { v7 as uuid } from 'uuid';

export interface EntityOptions {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export abstract class Entity<P> {
  protected _id: string;
  protected _createdAt: Date;
  protected _updatedAt: Date;
  protected props: P;

  constructor(props: P, options: EntityOptions = { }) {
    const now = new Date();
    this._id = options.id ?? uuid();
    this._createdAt = options.createdAt ?? now;
    this._updatedAt = options.updatedAt ?? now;
    this.props = props;
  }

  get id(): string {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  protected touch() {
    this._updatedAt = new Date();
  }
}