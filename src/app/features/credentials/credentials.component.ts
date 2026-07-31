import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class CredentialsComponent implements OnInit, OnDestroy {
  get courses(): Course[] { return this.dataService.courses; }
  get awards(): Award[] { return this.dataService.awards; }
  get education(): Education[] { return this.dataService.education; }
  visibleItems = new Set<string>();
  confettiFired = false;
  confettiParticles: { left: string; delay: string; duration: string; color: string }[] = [];

  private observer!: IntersectionObserver;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {


    // Build confetti
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

    setTimeout(() => this.setupObserver(), 100);
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
              if (id.startsWith('edu-') && !this.confettiFired) {
                this.confettiFired = true;
              }
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    document.querySelectorAll('[data-reveal-id]').forEach(el => this.observer.observe(el));
  }

  isVisible(id: string): boolean {
    return this.visibleItems.has(id);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  formatDateLong(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  formatYear(dateStr: string): number {
    return new Date(dateStr).getFullYear();
  }

  trackById(_: number, item: { id: string }): string { return item.id; }
}
