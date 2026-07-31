import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../core/services/data.service';
import { SiteConfig } from '../../core/models/site-config.model';

interface Milestone {
  year: string;
  title: string;
  desc: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements OnInit, OnDestroy {
  @ViewChild('sectionEl') sectionRef!: ElementRef;

  get config(): SiteConfig { return this.dataService.siteConfig; }
  visibleItems = new Set<number>();
  
  get milestones(): Milestone[] {
    const edu = this.dataService.education[0];
    const exp = this.dataService.experience[0];
    return [
      {
        year: edu?.startDate ? edu.startDate.slice(0, 4) : '2021',
        title: 'Started Computer Science',
        desc: edu ? `Began studying ${edu.field} at ${edu.institution}` : 'Began studying Computer Science at October 6 University',
      },
      {
        year: '2023',
        title: 'Discovered Flutter',
        desc: 'Fell in love with building beautiful, cross-platform mobile apps',
      },
      {
        year: '2024',
        title: 'Training & Diplomas',
        desc: 'Earned Flutter Development Diploma from Route Academy & UI/UX Training from NTI',
      },
      {
        year: '2026',
        title: 'Huawei ICT Award & Graduation',
        desc: 'Won 3rd Prize in Huawei ICT Regional Competition & Graduated Class of 2026',
      },
    ];
  }

  get philosophyWords(): string[] {
    return (this.config?.about?.philosophy || '').split(' ');
  }

  private observer!: IntersectionObserver;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    // Setup intersection observer after view is ready
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
            const idx = Number(entry.target.getAttribute('data-idx'));
            this.visibleItems = new Set([...this.visibleItems, idx]);
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('[data-idx]').forEach(el => this.observer.observe(el));
  }

  isVisible(idx: number): boolean {
    return this.visibleItems.has(idx);
  }

  getPhilosophyDelay(i: number): string {
    return this.visibleItems.has(this.config.about.bio.length)
      ? `${0.3 + i * 0.04}s`
      : '999s';
  }

  trackByIndex(i: number): number { return i; }
}
