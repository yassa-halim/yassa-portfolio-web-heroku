import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import {
  SiteConfig, Project, Skill, Course, Award, Education, Experience
} from '../models/site-config.model';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  folder: string;
  sizeKb: number;
  uploadedAt: string;
}

export interface SeoSetting {
  id: string;
  page: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  canonicalUrl: string;
}

@Injectable({ providedIn: 'root' })
export class DataService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  // Signals for reactive updates in Dashboard and Portfolio
  siteConfigSignal = signal<SiteConfig>(this.loadFromStorage('siteConfig', this.defaultSiteConfig()));
  projectsSignal = signal<Project[]>(this.loadFromStorage('projects', this.defaultProjects()));
  skillsSignal = signal<Skill[]>(this.loadFromStorage('skills', this.defaultSkills()));
  coursesSignal = signal<Course[]>(this.loadFromStorage('courses', this.defaultCourses()));
  awardsSignal = signal<Award[]>(this.loadFromStorage('awards', this.defaultAwards()));
  educationSignal = signal<Education[]>(this.loadFromStorage('education', this.defaultEducation()));
  experienceSignal = signal<Experience[]>([]);
  messagesSignal = signal<ContactMessage[]>(this.loadFromStorage('messages', this.defaultMessages()));
  mediaSignal = signal<MediaItem[]>(this.loadFromStorage('media', this.defaultMedia()));
  seoSignal = signal<SeoSetting[]>(this.loadFromStorage('seo', this.defaultSeo()));

  get siteConfig(): SiteConfig { return this.siteConfigSignal(); }
  get projects(): Project[] { return this.projectsSignal(); }
  get skills(): Skill[] { return this.skillsSignal(); }
  get courses(): Course[] { return this.coursesSignal(); }
  get awards(): Award[] { return this.awardsSignal(); }
  get education(): Education[] { return this.educationSignal(); }
  get experience(): Experience[] { return this.experienceSignal(); }

  constructor() {
    this.fetchDataFromBackend();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });
  }

  /**
   * Fetch initial live data from Node.js Express Backend
   */
  async fetchDataFromBackend(): Promise<void> {
    try {
      // Projects
      const projects = await firstValueFrom(this.http.get<Project[]>(`${environment.apiUrl}/projects`));
      if (projects && projects.length > 0) {
        this.projectsSignal.set(projects);
        this.saveToStorage('projects', projects);
      }

      // Skills
      const skills = await firstValueFrom(this.http.get<Skill[]>(`${environment.apiUrl}/skills`));
      if (skills && skills.length > 0) {
        this.skillsSignal.set(skills);
        this.saveToStorage('skills', skills);
      }

      // Courses
      const courses = await firstValueFrom(this.http.get<Course[]>(`${environment.apiUrl}/credentials/courses`));
      if (courses && courses.length > 0) {
        this.coursesSignal.set(courses);
        this.saveToStorage('courses', courses);
      }

      // Awards
      const awards = await firstValueFrom(this.http.get<Award[]>(`${environment.apiUrl}/credentials/awards`));
      if (awards && awards.length > 0) {
        this.awardsSignal.set(awards);
        this.saveToStorage('awards', awards);
      }

      // Settings
      const config = await firstValueFrom(this.http.get<SiteConfig>(`${environment.apiUrl}/settings`));
      if (config) {
        this.siteConfigSignal.set(config);
        this.saveToStorage('siteConfig', config);
      }
    } catch {
      console.warn('[DataService] Express API Backend offline, running with cached data.');
    }
  }

  // --- CRUD Methods ---
  async saveSiteConfig(config: SiteConfig): Promise<void> {
    this.siteConfigSignal.set(config);
    this.saveToStorage('siteConfig', config);
    try {
      await firstValueFrom(this.http.put(`${environment.apiUrl}/settings`, config, { headers: this.getAuthHeaders() }));
    } catch {}
  }

  // Projects
  async addProject(project: Omit<Project, 'id'>): Promise<void> {
    const newProject: Project = { ...project, id: Date.now().toString() };
    const updated = [newProject, ...this.projectsSignal()];
    this.projectsSignal.set(updated);
    this.saveToStorage('projects', updated);

    try {
      const res = await firstValueFrom(this.http.post<Project>(`${environment.apiUrl}/projects`, project, { headers: this.getAuthHeaders() }));
      if (res && res.id) {
        const synced = [res, ...this.projectsSignal().filter(p => p.id !== newProject.id)];
        this.projectsSignal.set(synced);
      }
    } catch {}
  }

  async updateProject(id: string, project: Partial<Project>): Promise<void> {
    const updated = this.projectsSignal().map(p => p.id === id ? { ...p, ...project } : p);
    this.projectsSignal.set(updated);
    this.saveToStorage('projects', updated);

    try {
      await firstValueFrom(this.http.put(`${environment.apiUrl}/projects/${id}`, project, { headers: this.getAuthHeaders() }));
    } catch {}
  }

  async deleteProject(id: string): Promise<void> {
    const updated = this.projectsSignal().filter(p => p.id !== id);
    this.projectsSignal.set(updated);
    this.saveToStorage('projects', updated);

    try {
      await firstValueFrom(this.http.delete(`${environment.apiUrl}/projects/${id}`, { headers: this.getAuthHeaders() }));
    } catch {}
  }

  // Skills
  async addSkill(skill: Omit<Skill, 'id'>): Promise<void> {
    const newSkill: Skill = { ...skill, id: Date.now().toString() };
    const updated = [...this.skillsSignal(), newSkill];
    this.skillsSignal.set(updated);
    this.saveToStorage('skills', updated);

    try {
      await firstValueFrom(this.http.post(`${environment.apiUrl}/skills`, skill, { headers: this.getAuthHeaders() }));
    } catch {}
  }

  async updateSkill(id: string, skill: Partial<Skill>): Promise<void> {
    const updated = this.skillsSignal().map(s => s.id === id ? { ...s, ...skill } : s);
    this.skillsSignal.set(updated);
    this.saveToStorage('skills', updated);

    try {
      await firstValueFrom(this.http.put(`${environment.apiUrl}/skills/${id}`, skill, { headers: this.getAuthHeaders() }));
    } catch {}
  }

  async deleteSkill(id: string): Promise<void> {
    const updated = this.skillsSignal().filter(s => s.id !== id);
    this.skillsSignal.set(updated);
    this.saveToStorage('skills', updated);

    try {
      await firstValueFrom(this.http.delete(`${environment.apiUrl}/skills/${id}`, { headers: this.getAuthHeaders() }));
    } catch {}
  }

  // Courses
  async addCourse(course: Omit<Course, 'id'>): Promise<void> {
    const newCourse: Course = { ...course, id: Date.now().toString() };
    const updated = [newCourse, ...this.coursesSignal()];
    this.coursesSignal.set(updated);
    this.saveToStorage('courses', updated);

    try {
      await firstValueFrom(this.http.post(`${environment.apiUrl}/credentials/courses`, course, { headers: this.getAuthHeaders() }));
    } catch {}
  }

  async deleteCourse(id: string): Promise<void> {
    const updated = this.coursesSignal().filter(c => c.id !== id);
    this.coursesSignal.set(updated);
    this.saveToStorage('courses', updated);

    try {
      await firstValueFrom(this.http.delete(`${environment.apiUrl}/credentials/courses/${id}`, { headers: this.getAuthHeaders() }));
    } catch {}
  }

  // Awards
  async addAward(award: Omit<Award, 'id'>): Promise<void> {
    const newAward: Award = { ...award, id: Date.now().toString() };
    const updated = [newAward, ...this.awardsSignal()];
    this.awardsSignal.set(updated);
    this.saveToStorage('awards', updated);

    try {
      await firstValueFrom(this.http.post(`${environment.apiUrl}/credentials/awards`, award, { headers: this.getAuthHeaders() }));
    } catch {}
  }

  async deleteAward(id: string): Promise<void> {
    const updated = this.awardsSignal().filter(a => a.id !== id);
    this.awardsSignal.set(updated);
    this.saveToStorage('awards', updated);

    try {
      await firstValueFrom(this.http.delete(`${environment.apiUrl}/credentials/awards/${id}`, { headers: this.getAuthHeaders() }));
    } catch {}
  }

  // Messages
  async addMessage(msg: { name: string; email: string; subject: string; body: string }): Promise<void> {
    const newMsg: ContactMessage = {
      ...msg,
      id: Date.now().toString(),
      read: false,
      createdAt: new Date().toISOString(),
    };
    const updated = [newMsg, ...this.messagesSignal()];
    this.messagesSignal.set(updated);
    this.saveToStorage('messages', updated);

    try {
      await firstValueFrom(this.http.post(`${environment.apiUrl}/messages`, msg));
    } catch {}
  }

  async toggleMessageRead(id: string): Promise<void> {
    const updated = this.messagesSignal().map(m => m.id === id ? { ...m, read: !m.read } : m);
    this.messagesSignal.set(updated);
    this.saveToStorage('messages', updated);

    try {
      await firstValueFrom(this.http.patch(`${environment.apiUrl}/messages/${id}/read`, {}, { headers: this.getAuthHeaders() }));
    } catch {}
  }

  async deleteMessage(id: string): Promise<void> {
    const updated = this.messagesSignal().filter(m => m.id !== id);
    this.messagesSignal.set(updated);
    this.saveToStorage('messages', updated);

    try {
      await firstValueFrom(this.http.delete(`${environment.apiUrl}/messages/${id}`, { headers: this.getAuthHeaders() }));
    } catch {}
  }

  // Media
  addMedia(item: Omit<MediaItem, 'id'>): void {
    const newItem: MediaItem = { ...item, id: Date.now().toString() };
    const updated = [newItem, ...this.mediaSignal()];
    this.mediaSignal.set(updated);
    this.saveToStorage('media', updated);
  }

  deleteMedia(id: string): void {
    const updated = this.mediaSignal().filter(m => m.id !== id);
    this.mediaSignal.set(updated);
    this.saveToStorage('media', updated);
  }

  // SEO
  updateSeo(id: string, seo: Partial<SeoSetting>): void {
    const updated = this.seoSignal().map(s => s.id === id ? { ...s, ...seo } : s);
    this.seoSignal.set(updated);
    this.saveToStorage('seo', updated);
  }

  // Helper storage methods
  private loadFromStorage<T>(key: string, defaultVal: T): T {
    if (typeof window === 'undefined') return defaultVal;
    const stored = localStorage.getItem(`yassa_${key}`);
    return stored ? JSON.parse(stored) : defaultVal;
  }

  private saveToStorage<T>(key: string, value: T): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`yassa_${key}`, JSON.stringify(value));
    }
  }

  // Default values
  private defaultSiteConfig(): SiteConfig {
    return {
      name: 'Yassa Halim Said',
      title: 'Flutter Developer & Software Engineer',
      description: 'From Code to Craft — a portfolio that behaves like a product, not a resume.',
      url: 'https://yassa.dev',
      email: 'yassahalim18@gmail.com',
      location: 'Egypt',
      socials: {
        github: 'https://github.com/yassahalim',
        linkedin: 'https://linkedin.com/in/yassahalim',
        twitter: 'https://twitter.com/yassahalim',
      },
      navLinks: [
        { label: 'Home', href: '#home' },
        { label: 'About', href: '#about' },
        { label: 'Skills', href: '#skills' },
        { label: 'Projects', href: '#projects' },
        { label: 'Courses', href: '#courses' },
        { label: 'Awards', href: '#awards' },
        { label: 'Contact', href: '#contact' },
      ],
      roles: ['Flutter Developer', 'Software Engineer', 'Mobile App Developer', 'UI/UX Enthusiast'],
      hero: {
        greeting: "Hello, I'm",
        name: 'Yassa Halim Said',
        subtitle: 'Building pixel-perfect mobile experiences with Flutter',
        cta: [
          { label: 'Download CV', href: '/assets/resume.pdf', variant: 'primary' },
          { label: 'Explore Projects', href: '#projects', variant: 'outline' },
          { label: 'Contact Me', href: '#contact', variant: 'ghost' },
        ],
      },
      about: {
        title: 'About Me',
        subtitle: 'The story behind the code',
        bio: [
          "I'm a passionate Flutter Developer and Software Engineer based in Egypt, dedicated to creating beautiful, performant mobile applications that make a real impact.",
          "With a strong foundation in computer science and a keen eye for design, I bridge the gap between technical excellence and user-centric experiences.",
          "I believe that great software is built widget by widget, with attention to every pixel and interaction.",
        ],
        philosophy: "Code is craft. Every widget is a building block. Every animation tells a story. Every app is an opportunity to make someone's day better.",
        stats: [
          { label: 'Projects Completed', value: '15+' },
          { label: 'Technologies Mastered', value: '20+' },
          { label: 'Courses Completed', value: '10+' },
          { label: 'Awards Won', value: '3' },
        ],
      },
    };
  }

  private defaultProjects(): Project[] {
    return [
      {
        id: '1', slug: 'taskflow-app', title: 'TaskFlow', subtitle: 'Smart Task Management',
        category: 'Mobile App',
        description: 'A beautiful task management application built with Flutter featuring smooth animations, real-time sync, and an intuitive drag-and-drop interface.',
        coverImage: '/uploads/1783574845336-277703199-1.jpg',
        techStack: ['Flutter', 'Dart', 'Firebase', 'Provider', 'Hive'],
        features: ['Real-time sync', 'Custom animations', 'Drag-and-drop', 'Dark/Light theme', 'Push notifications'],
        challenges: 'Implementing smooth drag-and-drop with 60fps performance on older devices.',
        solutions: 'Used ReorderableListView with custom physics and optimized rebuild cycles.',
        githubUrl: 'https://github.com/yassahalim/taskflow', liveUrl: '',
        status: 'published', projectDate: '2025-06-15', tags: ['Flutter', 'Firebase', 'Mobile'],
        accentColor: '#A55B4B', order: 1,
      },
      {
        id: '2', slug: 'shopwave-ecommerce', title: 'ShopWave', subtitle: 'E-Commerce Platform',
        category: 'Mobile App',
        description: 'A full-featured e-commerce mobile application with payment integration, real-time inventory, and personalized recommendations.',
        coverImage: 'https://images.unsplash.com/photo-1557821552-17105176677c',
        techStack: ['Flutter', 'Dart', 'Node.js', 'MongoDB', 'Stripe', 'BLoC'],
        features: ['Stripe integration', 'Real-time inventory', 'AI recommendations', 'Multi-language', 'Order tracking'],
        challenges: 'Building a scalable state management solution for complex cart logic.',
        solutions: 'Implemented BLoC pattern with event-driven architecture.',
        githubUrl: 'https://github.com/yassahalim/shopwave', liveUrl: '',
        status: 'published', projectDate: '2025-03-20', tags: ['Flutter', 'E-Commerce', 'Node.js'],
        accentColor: '#4F1C51', order: 2,
      },
      {
        id: '3', slug: 'healthmate-tracker', title: 'HealthMate', subtitle: 'Fitness & Health Tracker',
        category: 'Mobile App',
        description: 'A comprehensive health tracking app with workout plans, nutrition tracking, and progress visualization.',
        coverImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
        techStack: ['Flutter', 'Dart', 'Firebase', 'FL Chart', 'Riverpod'],
        features: ['Workout generator', 'Nutrition tracking', 'Progress charts', 'Health sync', 'Social challenges'],
        challenges: 'Creating smooth interactive charts while handling large health datasets.',
        solutions: 'Used FL Chart with custom painters and Hive for offline-first caching.',
        githubUrl: 'https://github.com/yassahalim/healthmate', liveUrl: '',
        status: 'published', projectDate: '2025-01-10', tags: ['Flutter', 'Health', 'Firebase'],
        accentColor: '#DCA06D', order: 3,
      },
      {
        id: '4', slug: 'chatverse-messenger', title: 'ChatVerse', subtitle: 'Real-Time Messaging',
        category: 'Mobile App',
        description: 'A feature-rich messaging app with end-to-end encryption, voice/video calls, and a stories feature.',
        coverImage: 'https://images.unsplash.com/photo-1611606063065-ee7946f0787a',
        techStack: ['Flutter', 'Dart', 'Firebase', 'WebRTC', 'GetX'],
        features: ['E2E encryption', 'Voice & video', 'Stories', 'File sharing', 'Custom stickers'],
        challenges: 'Implementing real-time WebRTC calls with battery efficiency.',
        solutions: 'Custom WebRTC wrapper with auto-reconnect and ICE optimization.',
        githubUrl: 'https://github.com/yassahalim/chatverse', liveUrl: '',
        status: 'published', projectDate: '2024-11-05', tags: ['Flutter', 'WebRTC', 'Chat'],
        accentColor: '#210F37', order: 4,
      },
      {
        id: '5', slug: 'portfolio-website', title: 'Portfolio v2', subtitle: 'Personal Brand Website',
        category: 'Web',
        description: 'This very portfolio — a cinematic, engineering-themed showcase built with Angular.',
        coverImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
        techStack: ['Angular', 'TypeScript', 'CSS Animations', 'RxJS'],
        features: ['Widget-tree animation', '3D aurora mesh', 'Command palette', 'CMS dashboard'],
        challenges: 'Creating a cinematic experience that loads fast and stands out.',
        solutions: 'Layered animation: Angular Animations + CSS Keyframes + 3D effects.',
        githubUrl: 'https://github.com/yassahalim/portfolio-v2', liveUrl: 'https://yassa.dev',
        status: 'published', projectDate: '2025-07-01', tags: ['Angular', 'TypeScript'],
        accentColor: '#A55B4B', order: 5,
      },
      {
        id: '6', slug: 'weather-now', title: 'WeatherNow', subtitle: 'Beautiful Weather App',
        category: 'Mobile App',
        description: 'A visually stunning weather app with animated conditions and Lottie animations.',
        coverImage: 'https://images.unsplash.com/photo-1504608524841-42584120d693',
        techStack: ['Flutter', 'Dart', 'OpenWeather API', 'Lottie', 'Provider'],
        features: ['Animated conditions', 'Location forecasts', 'Hourly predictions', 'Weather alerts'],
        challenges: 'Fluid animations responding to real data while keeping the app lightweight.',
        solutions: 'Lottie with dynamic color mapping and efficient API caching.',
        githubUrl: 'https://github.com/yassahalim/weather-now', liveUrl: '',
        status: 'published', projectDate: '2024-08-15', tags: ['Flutter', 'API', 'Animation'],
        accentColor: '#4F1C51', order: 6,
      },
    ];
  }

  private defaultSkills(): Skill[] {
    return [
      { id: '1', name: 'Flutter', category: 'Frontend', proficiency: 95, icon: '💎', order: 1 },
      { id: '2', name: 'Dart', category: 'Languages', proficiency: 92, icon: '🎯', order: 2 },
      { id: '3', name: 'React', category: 'Frontend', proficiency: 85, icon: '⚛️', order: 3 },
      { id: '4', name: 'Next.js', category: 'Frontend', proficiency: 80, icon: '▲', order: 4 },
      { id: '5', name: 'TypeScript', category: 'Languages', proficiency: 82, icon: '📘', order: 5 },
      { id: '6', name: 'JavaScript', category: 'Languages', proficiency: 90, icon: '⚡', order: 6 },
      { id: '7', name: 'Python', category: 'Languages', proficiency: 75, icon: '🐍', order: 7 },
      { id: '8', name: 'Firebase', category: 'Backend', proficiency: 88, icon: '🔥', order: 8 },
      { id: '9', name: 'Node.js', category: 'Backend', proficiency: 78, icon: '🟢', order: 9 },
      { id: '10', name: 'MongoDB', category: 'Backend', proficiency: 72, icon: '🍃', order: 10 },
      { id: '11', name: 'Git', category: 'Tools', proficiency: 90, icon: '🔀', order: 11 },
      { id: '12', name: 'Figma', category: 'Tools', proficiency: 70, icon: '🎨', order: 12 },
      { id: '13', name: 'REST APIs', category: 'Backend', proficiency: 88, icon: '🔗', order: 13 },
      { id: '14', name: 'BLoC Pattern', category: 'Architecture', proficiency: 90, icon: '🧱', order: 14 },
      { id: '15', name: 'Provider', category: 'Architecture', proficiency: 92, icon: '📦', order: 15 },
      { id: '16', name: 'Clean Architecture', category: 'Architecture', proficiency: 85, icon: '🏗️', order: 16 },
    ];
  }

  private defaultCourses(): Course[] {
    return [
      { id: '1', title: 'The Complete Flutter Development Bootcamp', provider: 'Udemy', hours: 42, certificateUrl: '#', completedAt: '2024-06-15', order: 1 },
      { id: '2', title: 'Flutter & Dart - The Complete Guide', provider: 'Academind', hours: 56, certificateUrl: '#', completedAt: '2024-03-20', order: 2 },
      { id: '3', title: 'Advanced Flutter — State Management (BLoC)', provider: 'NTI', hours: 30, certificateUrl: '#', completedAt: '2025-01-10', order: 3 },
      { id: '4', title: 'React - The Complete Guide', provider: 'Udemy', hours: 48, certificateUrl: '#', completedAt: '2024-09-05', order: 4 },
      { id: '5', title: 'Firebase in Depth', provider: 'Firebase', hours: 20, certificateUrl: '#', completedAt: '2024-04-12', order: 5 },
      { id: '6', title: 'UI/UX Design Fundamentals', provider: 'Google', hours: 16, certificateUrl: '#', completedAt: '2024-07-22', order: 6 },
    ];
  }

  private defaultAwards(): Award[] {
    return [
      { id: '1', title: 'Best Mobile App', issuer: 'NTI Innovation Challenge', description: 'Awarded for the most innovative Flutter app at the NTI annual hackathon.', date: '2025-03-15', icon: '🏆', order: 1 },
      { id: '2', title: '3rd Place — App Dev', issuer: 'University Tech Competition 2025', description: 'Recognized for outstanding performance in the university-wide app competition.', date: '2025-05-20', icon: '🥉', order: 2 },
      { id: '3', title: "Dean's List", issuer: 'Faculty of Computer Science', description: 'Honored for exceptional academic performance throughout the academic year.', date: '2024-12-01', icon: '⭐', order: 3 },
    ];
  }

  private defaultEducation(): Education[] {
    return [
      {
        id: '1',
        institution: 'University of Egypt',
        degree: "Bachelor's Degree",
        field: 'Computer Science',
        startDate: '2021-09-01',
        endDate: '2025-06-30',
        description: 'Comprehensive degree in Computer Science with focus on mobile development, software engineering, and AI.',
      },
    ];
  }

  private defaultMessages(): ContactMessage[] {
    return [
      { id: '1783574717039', name: 'Yassa Halim', email: 'admin@yassa.dev', subject: 'Project Inquiry', body: 'Hi Yassa, I loved your portfolio! Are you available for a Flutter contract?', read: false, createdAt: '2026-07-09T05:25:17.039Z' }
    ];
  }

  private defaultMedia(): MediaItem[] {
    return [
      { id: '1', name: '1783574845336-277703199-1.jpg', url: '/uploads/1783574845336-277703199-1.jpg', folder: 'projects', sizeKb: 169, uploadedAt: '2026-07-03T23:50:55.356Z' },
      { id: '2', name: 'shopwave_cover.jpg', url: 'https://images.unsplash.com/photo-1557821552-17105176677c', folder: 'projects', sizeKb: 284, uploadedAt: '2026-07-05T23:50:55.356Z' }
    ];
  }

  private defaultSeo(): SeoSetting[] {
    return [
      { id: '1', page: 'Home Page', metaTitle: 'Yassa Halim Said — Flutter Developer & Software Engineer', metaDescription: 'Portfolio of Yassa Halim Said — building pixel-perfect mobile apps.', keywords: 'Yassa, Flutter, Developer, Egypt', canonicalUrl: 'https://yassa.dev' },
      { id: '2', page: 'Projects Page', metaTitle: 'Showcase Works — Yassa Halim Said', metaDescription: 'Explore custom Flutter builds and web interfaces crafted by Yassa Halim Said.', keywords: 'Flutter Showcase, Portfolio, Apps', canonicalUrl: 'https://yassa.dev#projects' }
    ];
  }
}
