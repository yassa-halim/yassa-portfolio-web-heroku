import { Component, OnInit, OnDestroy, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../core/services/data.service';
import { ScrollService } from '../../core/services/scroll.service';
import { SiteConfig } from '../../core/models/site-config.model';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css'],
})
export class HeroComponent implements OnInit, OnDestroy {
  @ViewChild('heroSection') heroRef!: ElementRef<HTMLDivElement>;

  config!: SiteConfig;
  roles: string[] = [];
  heroVisible = false;
  widgetNodes: boolean[] = [];

  // Typewriter state
  roleIndex = 0;
  roleText = '';
  isTyping = true;
  private typeTimer: any;

  get nameChars(): string[] {
    return this.config?.hero.name.split('') ?? [];
  }

  constructor(
    private dataService: DataService,
    private scrollService: ScrollService
  ) {}

  ngOnInit(): void {
    this.config = this.dataService.siteConfig;
    this.roles = [...this.config.roles];

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      this.heroVisible = true;
      this.widgetNodes = new Array(6).fill(true);
      this.roleText = this.roles[0] ?? 'Flutter Developer';
    } else {
      this.bootSequence();
      this.typeNext();
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.typeTimer);
  }

  private async bootSequence(): Promise<void> {
    await this.delay(200);
    this.heroVisible = true;

    for (let i = 0; i < 6; i++) {
      await this.delay(120);
      this.widgetNodes = [...this.widgetNodes, true];
    }
  }

  private typeNext(): void {
    const currentRole = this.roles[this.roleIndex] ?? 'Flutter Developer';

    if (this.isTyping) {
      if (this.roleText.length < currentRole.length) {
        this.roleText = currentRole.slice(0, this.roleText.length + 1);
        this.typeTimer = setTimeout(() => this.typeNext(), 60);
      } else {
        this.typeTimer = setTimeout(() => {
          this.isTyping = false;
          this.typeNext();
        }, 2000);
      }
    } else {
      if (this.roleText.length > 0) {
        this.roleText = this.roleText.slice(0, -1);
        this.typeTimer = setTimeout(() => this.typeNext(), 30);
      } else {
        this.roleIndex = (this.roleIndex + 1) % this.roles.length;
        this.isTyping = true;
        this.typeNext();
      }
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    if (!this.heroRef?.nativeElement) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 24;
    const y = (e.clientY / window.innerHeight - 0.5) * 24;
    this.heroRef.nativeElement.style.setProperty('--mouse-x', `${x}px`);
    this.heroRef.nativeElement.style.setProperty('--mouse-y', `${y}px`);
  }

  handleCta(href: string): void {
    if (href.startsWith('#')) {
      this.scrollService.scrollToHref(href);
    } else {
      window.open(href, '_blank');
    }
  }

  nodeVisible(idx: number): boolean {
    return !!this.widgetNodes[idx];
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
