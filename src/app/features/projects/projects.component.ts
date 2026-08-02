import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../core/services/data.service';
import { Project } from '../../core/models/project.model';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent implements OnInit, OnDestroy {
  get projects(): Project[] { return this.dataService.projects; }
  activeFilter = 'All';
  selectedProject: Project | null = null;
  depthMode: 'quick' | 'deep' = 'quick';

  // For dynamic auto-sliding carousel in cards
  activeIndices: { [id: string]: number } = {};
  private slideInterval: any;

  get categories(): string[] {
    return ['All', ...Array.from(new Set(this.projects.map(p => p.category)))];
  }

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    // Start global slideshow interval (changes slide every 3 seconds)
    this.slideInterval = setInterval(() => {
      this.projects.forEach(p => {
        if (p.images && p.images.length > 1) {
          const current = this.activeIndices[p.id] || 0;
          this.activeIndices[p.id] = (current + 1) % p.images.length;
        }
      });
    }, 3000);
  }

  ngOnDestroy(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  get filteredProjects(): Project[] {
    return this.projects.filter(
      p => p.status === 'published' &&
           (this.activeFilter === 'All' || p.category === this.activeFilter)
    );
  }

  openModal(project: Project): void {
    this.selectedProject = project;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.selectedProject = null;
    document.body.style.overflow = '';
  }

  onCardTilt(e: MouseEvent, card: HTMLElement): void {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = ((y - cy) / cy) * -8;
    const ry = ((x - cx) / cx) * 8;
    card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`;
    card.style.setProperty('--glare-x', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--glare-y', `${(y / rect.height) * 100}%`);
  }

  resetCardTilt(card: HTMLElement): void {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
  }

  trackById(_: number, p: Project): string { return p.id; }
}
