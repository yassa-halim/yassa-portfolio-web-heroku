import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'yassa_admin_token';
  isLoggedIn = signal<boolean>(this.checkToken());

  private checkToken(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  login(password: string): boolean {
    // Demo admin password check
    if (password === 'admin123' || password === 'yassa2025') {
      localStorage.setItem(this.TOKEN_KEY, 'demo-admin-session-token');
      this.isLoggedIn.set(true);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.isLoggedIn.set(false);
  }
}
