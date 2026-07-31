import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scroll-progress',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="scroll-progress" [style.transform]="'scaleX(' + progress + ')'"></div>`,
})
export class ScrollProgressComponent implements OnInit, OnDestroy {
  progress = 0;

  @HostListener('window:scroll')
  onScroll(): void {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    this.progress = docHeight > 0 ? scrollTop / docHeight : 0;
  }

  ngOnInit(): void {}
  ngOnDestroy(): void {}
}
