import { Component, OnInit, OnDestroy, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../core/services/data.service';
import { Course, Award, Education } from '../../core/models/site-config.model';

@Component({
  selector: 'app-credentials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './credentials.component.html',
  styleUrls: ['./credentials.component.css'],
})
export class CredentialsComponent implements OnInit, OnDestroy, AfterViewChecked {
  get courses(): Course[] { return this.dataService.courses; }
  get awards(): Award[] { return this.dataService.awards; }
  get education(): Education[] { return this.dataService.education; }
  visibleItems = new Set<string>();
  confettiFired = false;
  confettiParticles: { left: string; delay: string; duration: string; color: string }[] = [];

  private observer!: IntersectionObserver;
  private lastObservedCount = 0;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    const colors = ['var(--accent)', 'var(--highlight)', 'var(--secondary)', '#22c55e', '#3b82f6'];
    this.confettiParticles = Array.from({ length: 20 }, (_, i) => {
      const seed = (i * 7 + 3) % 20;
      return {
        left: `${(seed / 20) * 100}%`,
        delay: `${(i % 10) * 0.05}s`,
        duration: `${1 + (seed / 20) * 1.5}s`,
        color: colors[i % 5],
      };
    });

    this.setupObserver();
  }

  ngAfterViewChecked(): void {
    // Re-observe whenever new elements are rendered by *ngFor
    const elements = document.querySelectorAll('[data-reveal-id]');
    if (elements.length !== this.lastObservedCount) {
      this.lastObservedCount = elements.length;
      elements.forEach(el => {
        const id = el.getAttribute('data-reveal-id');
        if (id && !this.visibleItems.has(id)) {
          this.observer?.observe(el);
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private setupObserver(): void {
    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-reveal-id');
            if (id) {
              this.visibleItems = new Set([...this.visibleItems, id]);
              this.observer.unobserve(entry.target);
              if (id.startsWith('edu-') && !this.confettiFired) {
                this.confettiFired = true;
              }
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );
  }

  isVisible(id: string): boolean {
    return this.visibleItems.has(id);
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  formatDateLong(dateStr: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  formatYear(dateStr: string): number {
    if (!dateStr) return 0;
    return new Date(dateStr).getFullYear();
  }

  trackById(_: number, item: { id: string }): string { return item.id; }
}
