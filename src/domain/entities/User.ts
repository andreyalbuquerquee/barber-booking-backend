import { Entity, type EntityOptions } from '../core/Entity';
import type { Replace } from '../core/Replace';
import type { RoleCode } from './Role';

export interface UserProps {
  name: string;
  email: string;
  passwordHash: string;
  role: RoleCode;
  isActive: boolean;
}

export class User extends Entity<UserProps> {

  constructor(
    props: Replace<UserProps, { role?: RoleCode; isActive?: boolean }>,
    options?: EntityOptions
  ) {
    super(
      {
        name: props.name,
        email: props.email.toLowerCase(),
        passwordHash: props.passwordHash,
        role: props.role ?? ('BARBER' as RoleCode),
        isActive: props.isActive ?? true,
      },
      options
    );
  }

  get name(): string {
    return this.props.name;
  }
  set name(value: string) {
    this.props.name = value;
    this.touch();
  }

  get email(): string {
    return this.props.email;
  }
  set email(value: string) {
    this.props.email = value;
    this.touch();
  }

  get passwordHash(): string {
    return this.props.passwordHash;
  }
  set passwordHash(value: string) {
    this.props.passwordHash = value;
    this.touch();
  }

  get role(): RoleCode {
    return this.props.role;
  }
  set role(value: RoleCode) {
    this.props.role = value;
    this.touch();
  }

  get isActive(): boolean {
    return this.props.isActive;
  }
  
  activate() {
    if (!this.props.isActive) {
      this.props.isActive = true;
      this.touch();
    }
  }
  deactivate() {
    if (this.props.isActive) {
      this.props.isActive = false;
      this.touch();
    }
  }
}
