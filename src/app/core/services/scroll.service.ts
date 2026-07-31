import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ScrollService {
  private commandPaletteOpen$ = new Subject<void>();
  commandPaletteOpen = this.commandPaletteOpen$.asObservable();

  constructor(private ngZone: NgZone) {}

  scrollTo(id: string): void {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  scrollToHref(href: string): void {
    const id = href.replace('#', '');
    this.scrollTo(id);
  }

  openCommandPalette(): void {
    this.commandPaletteOpen$.next();
  }
}
