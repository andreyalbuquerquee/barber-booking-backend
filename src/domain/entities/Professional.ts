import { Entity, type EntityOptions } from '../core/Entity';
import { Replace } from '../core/Replace';

export interface ProfessionalProps {
  userId: string;
  fullName: string;
  slug: string;
  phone: string;
  bio: string;
  timezone: string;
  active: boolean;
}

function slugify(input: string): string {
  const s = input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  return s
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export class Professional extends Entity<ProfessionalProps> {
  constructor(
    props: Replace<
      ProfessionalProps,
      {
        timezone?: string;
        active?: boolean;
      }
    >,
    options?: EntityOptions
  ) {
    super(
      {
        userId: props.userId,
        fullName: props.fullName.trim(),
        slug: slugify(props.slug),
        phone: props.phone,
        bio: props.bio,
        timezone: props.timezone ?? 'America/Recife',
        active: props.active ?? true,
      },
      options
    );
  }

  get userId(): string { 
    return this.props.userId; 
  }

  get fullName(): string { 
    return this.props.fullName; 
  }
  set fullName(value: string) { 
    this.props.fullName = value.trim(); 
    this.touch(); 
  }

  get slug(): string { 
    return this.props.slug; 
  }
  set slug(value: string) { 
    this.props.slug = slugify(value); 
    this.touch(); 
  }

  get phone(): string { 
    return this.props.phone; 
  }
  set phone(value: string) { 
    this.props.phone = value; 
    this.touch(); 
  }

  get bio(): string { 
    return this.props.bio; 
  }
  set bio(value: string) { 
    this.props.bio = value; 
    this.touch(); 
  }

  get timezone(): string { 
    return this.props.timezone; 
  }
  
  set timezone(value: string) { 
    this.props.timezone = value; 
    this.touch(); 
  }

  get active(): boolean { 
    return this.props.active;
  }
  
  activate() { 
    if (!this.props.active) { 
      this.props.active = true; 
      this.touch(); 
    } 
  }
  
  deactivate() { 
    if (this.props.active) { 
      this.props.active = false; 
      this.touch(); 
    } 
  }
}
