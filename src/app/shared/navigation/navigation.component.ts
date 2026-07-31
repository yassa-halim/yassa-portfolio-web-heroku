import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../core/services/data.service';
import { ScrollService } from '../../core/services/scroll.service';
import { ThemeService, AccentColor } from '../../core/services/theme.service';
import { NavLink } from '../../core/models/site-config.model';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit, OnDestroy {
  isScrolled = false;
  activeSection = 'home';
  isMobileMenuOpen = false;
  cmdKey = '⌘';
  get navLinks(): NavLink[] { return this.dataService.siteConfig.navLinks; }
  private ticking = false;

  constructor(
    private dataService: DataService,
    private scrollService: ScrollService,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    const isMac = navigator.userAgent.includes('Mac') || (navigator as any).platform?.includes('Mac');
    if (!isMac) this.cmdKey = 'Ctrl';
  }

  ngOnDestroy(): void {}

  @HostListener('window:scroll')
  onScroll(): void {
    if (!this.ticking) {
      window.requestAnimationFrame(() => {
        this.isScrolled = window.scrollY > 50;
        const sections = [...this.navLinks].reverse().map(l => l.href.replace('#', ''));
        for (const section of sections) {
          const el = document.getElementById(section);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 150) {
              this.activeSection = section;
              break;
            }
          }
        }
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Escape') this.isMobileMenuOpen = false;
  }

  handleNavClick(href: string): void {
    this.isMobileMenuOpen = false;
    this.scrollService.scrollToHref(href);
  }

  openCommandPalette(): void {
    this.scrollService.openCommandPalette();
  }

  isActive(href: string): boolean {
    return this.activeSection === href.replace('#', '');
  }

  trackByHref(_: number, link: NavLink): string {
    return link.href;
  }
}
