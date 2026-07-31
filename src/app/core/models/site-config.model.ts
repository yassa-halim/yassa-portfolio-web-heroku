export * from './project.model';

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  icon: string;
  order: number;
}

export interface Course {
  id: string;
  title: string;
  provider: string;
  hours: number;
  certificateUrl: string;
  completedAt: string;
  order: number;
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  description: string;
  date: string;
  icon: string;
  order: number;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
  techStack: string[];
}

export interface NavLink {
  label: string;
  href: string;
}

export interface CtaButton {
  label: string;
  href: string;
  variant: 'primary' | 'outline' | 'ghost';
}

export interface Stat {
  label: string;
  value: string;
}

export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  url: string;
  email: string;
  location: string;
  socials: {
    github: string;
    linkedin: string;
    twitter: string;
  };
  navLinks: NavLink[];
  roles: string[];
  hero: {
    greeting: string;
    name: string;
    subtitle: string;
    cta: CtaButton[];
  };
  about: {
    title: string;
    subtitle: string;
    bio: string[];
    philosophy: string;
    stats: Stat[];
  };
}
