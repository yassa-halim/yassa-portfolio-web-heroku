import { Component, OnInit, HostListener, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scroll-progress',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="scrollTrack" aria-hidden="true">
      <div class="scrollBar" [style.width.%]="progress"></div>
    </div>
  `,
  styleUrls: ['./scroll-progress.component.css']
})
export class ScrollProgressComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  progress = 0;

  ngOnInit(): void {
    this.updateProgress();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.updateProgress();
  }

  private updateProgress(): void {
    if (typeof window === 'undefined') return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    this.progress = scrollHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100)) : 0;
    this.cdr.markForCheck();
  }
}
