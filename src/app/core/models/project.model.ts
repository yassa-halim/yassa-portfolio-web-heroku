export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  coverImage: string;
  techStack: string[];
  features: string[];
  challenges: string;
  solutions: string;
  githubUrl: string;
  liveUrl: string;
  status: 'published' | 'draft';
  projectDate: string;
  tags: string[];
  accentColor: string;
  order: number;
}
