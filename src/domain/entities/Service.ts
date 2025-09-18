import { Entity, type EntityOptions } from '../core/Entity';
import type { Replace } from '../core/Replace';

export interface ServiceProps {
  name: string;
  durationMinutes: number;
  priceBrl: number | null;
  active: boolean;
}

export class Service extends Entity<ServiceProps> {
  
  constructor(
    props: Replace<ServiceProps, { active?: boolean; priceBrl?: number | null }>,
    options?: EntityOptions
  ) {
    super(
      {
        name: props.name,
        durationMinutes: props.durationMinutes,
        priceBrl: props.priceBrl ?? null,
        active: props.active ?? true,
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

  get durationMinutes(): number {
    return this.props.durationMinutes;
  }
  set durationMinutes(value: number) {
    this.props.durationMinutes = value;
    this.touch();
  }

  get priceBrl(): number | null {
    return this.props.priceBrl;
  }
  set priceBrl(value: number | null) {
    this.props.priceBrl = value;
    this.touch();
  }

  get active(): boolean {
    return this.props.active;
  }
  
  deactivate() {
    if (this.props.active) {
      this.props.active = false;
      this.touch();
    }
  }

  activate() {
    if (!this.props.active) {
      this.props.active = true;
      this.touch();
    }
  }
}