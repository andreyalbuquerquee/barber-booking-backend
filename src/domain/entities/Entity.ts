import { v7 as uuid } from 'uuid';

export interface EntityProps {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export abstract class Entity {
  private _id: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props?: EntityProps) {
    this._id = props?.id || uuid();
    this._createdAt = props?.createdAt || new Date();
    this._updatedAt = props?.updatedAt || new Date();
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

  onUpdated() {
    this._updatedAt = new Date();
  }
}