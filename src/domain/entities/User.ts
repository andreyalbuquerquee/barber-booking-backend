import { Entity, type EntityProps } from "./Entity";
import type { RoleCode } from "./Role";

export interface UserProps extends EntityProps {
  name: string;
  email: string;
  passwordHash: string;
  role: RoleCode;
  isActive: boolean;
}

export class User extends Entity {
  private readonly props: UserProps;

  constructor(props: UserProps) {
    super(props);
    this.props = props;
  }

  get name(): string {
    return this.props.name;
  }
  set name(value: string) {
    this.props.name = value;
  }

  get email(): string {
    return this.props.email;
  }
  set email(value: string) {
    this.props.email = value;
  }

  get passwordHash(): string {
    return this.props.passwordHash;
  }
  set passwordHash(value: string) {
    this.props.passwordHash = value;
  }

  get role(): RoleCode {
    return this.props.role;
  }
  set role(value: RoleCode) {
    this.props.role = value;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }
  set isActive(value: boolean) {
    this.props.isActive = value;
  }
}
