import { Injectable, signal } from '@angular/core';

export type ThemeMode = 'dark' | 'light';
export type AccentColor = 'cyan' | 'emerald' | 'purple' | 'amber' | 'rose';

export interface AccentTheme {
  name: AccentColor;
  primary: string;
  gradient: string;
  glow: string;
}

export const ACCENT_THEMES: Record<AccentColor, AccentTheme> = {
  cyan: {
    name: 'cyan',
    primary: '#00E5FF',
    gradient: 'linear-gradient(135deg, #00E5FF, #0088FF)',
    glow: 'rgba(0, 229, 255, 0.4)',
  },
  emerald: {
    name: 'emerald',
    primary: '#10B981',
    gradient: 'linear-gradient(135deg, #10B981, #059669)',
    glow: 'rgba(16, 185, 129, 0.4)',
  },
  purple: {
    name: 'purple',
    primary: '#A855F7',
    gradient: 'linear-gradient(135deg, #A855F7, #6366F1)',
    glow: 'rgba(168, 85, 247, 0.4)',
  },
  amber: {
    name: 'amber',
    primary: '#F59E0B',
    gradient: 'linear-gradient(135deg, #F59E0B, #D97706)',
    glow: 'rgba(245, 158, 11, 0.4)',
  },
  rose: {
    name: 'rose',
    primary: '#F43F5E',
    gradient: 'linear-gradient(135deg, #F43F5E, #E11D48)',
    glow: 'rgba(244, 63, 94, 0.4)',
  },
};

@Injectable({ providedIn: 'root' })
export class ThemeService {
  mode = signal<ThemeMode>(this.getInitialMode());
  accent = signal<AccentColor>(this.getInitialAccent());

  constructor() {
    this.applyTheme();
  }

  private getInitialMode(): ThemeMode {
    if (typeof window === 'undefined') return 'dark';
    return (localStorage.getItem('yassa_theme_mode') as ThemeMode) || 'dark';
  }

  private getInitialAccent(): AccentColor {
    if (typeof window === 'undefined') return 'cyan';
    return (localStorage.getItem('yassa_theme_accent') as AccentColor) || 'cyan';
  }

  toggleMode(): void {
    const next = this.mode() === 'dark' ? 'light' : 'dark';
    this.mode.set(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('yassa_theme_mode', next);
    }
    this.applyTheme();
  }

  setAccent(accent: AccentColor): void {
    this.accent.set(accent);
    if (typeof window !== 'undefined') {
      localStorage.setItem('yassa_theme_accent', accent);
    }
    this.applyTheme();
  }

  private applyTheme(): void {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.setAttribute('data-theme', this.mode());

    const activeTheme = ACCENT_THEMES[this.accent()];
    root.style.setProperty('--primary-color', activeTheme.primary);
    root.style.setProperty('--primary-gradient', activeTheme.gradient);
    root.style.setProperty('--primary-glow', activeTheme.glow);
  }
}
