export enum RoleCode {
  ADMIN = 'ADMIN',
  BARBER = 'BARBER',
}

export const ROLE_HIERARCHY: Record<RoleCode, ReadonlySet<RoleCode>> = {
  [RoleCode.ADMIN]: new Set([RoleCode.ADMIN, RoleCode.BARBER]),
  [RoleCode.BARBER]: new Set([RoleCode.BARBER]),
};

export class Role {
  private readonly _code: RoleCode;

  private constructor(code: RoleCode) {
    this._code = code;
  }

  public static of(code: RoleCode) {
    return new Role(code);
  }

  public get code(): RoleCode {
    return this._code;
  }

  public isAtLeast(other: RoleCode): boolean {
    return ROLE_HIERARCHY[this._code].has(other);
  }
}
