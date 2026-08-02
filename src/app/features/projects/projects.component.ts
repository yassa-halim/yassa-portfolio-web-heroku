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
    this.startSlideInterval();
  }

  startSlideInterval(): void {
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

  activeModalIndex = 0;

  openModal(project: Project): void {
    this.selectedProject = project;
    this.activeModalIndex = 0;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.selectedProject = null;
    document.body.style.overflow = '';
  }

  setModalImage(index: number): void {
    this.activeModalIndex = index;
  }

  getCoverflowStyle(index: number): any {
    if (!this.selectedProject?.images) return {};
    
    const total = this.selectedProject.images.length;
    let diff = index - this.activeModalIndex;
    
    // Wrap-around math for infinite circular feel
    if (total > 2) {
      if (diff > Math.floor(total / 2)) diff -= total;
      if (diff < -Math.floor(total / 2)) diff += total;
    }

    if (diff === 0) {
      return {
        transform: 'translateX(0) scale(1) translateZ(0)',
        zIndex: 10,
        opacity: 1,
        filter: 'brightness(1)',
        cursor: 'default'
      };
    } else {
      const direction = diff > 0 ? 1 : -1;
      const absDiff = Math.abs(diff);
      
      if (absDiff > 2) {
        return {
          transform: `translateX(${direction * 100}%) scale(0.6) translateZ(-400px)`,
          zIndex: 0,
          opacity: 0,
          pointerEvents: 'none'
        };
      }

      // X translation pushes them to sides, scale makes them smaller, Z pushes them back
      // Brightness makes them dark ("تغمق لما ترحع خلف الكرت")
      return {
        transform: `translateX(${direction * (30 + absDiff * 35)}%) scale(${1 - absDiff * 0.15}) translateZ(${-absDiff * 100}px)`,
        zIndex: 10 - absDiff,
        opacity: 1,
        filter: `brightness(${1 - absDiff * 0.5})`,
        cursor: 'pointer'
      };
    }
  }

  setSlideIndex(projectId: string, index: number): void {
    this.activeIndices[projectId] = index;
    // Optional: Reset the interval timer so it doesn't instantly jump after manual click
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.startSlideInterval();
    }
  }

  trackById(_: number, p: Project): string { return p.id; }
}
