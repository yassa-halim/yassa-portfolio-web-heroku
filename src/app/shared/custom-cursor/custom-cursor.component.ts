import { Component, OnInit, OnDestroy, HostListener, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-cursor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="enabled"
      class="customCursor"
      [class.cursorHovered]="isHovered"
      [class.cursorActive]="isActive"
      [style.transform]="cursorTransform"
      aria-hidden="true">
      <div class="cursorDot"></div>
      <div class="cursorRing"></div>
      <span *ngIf="cursorLabel" class="cursorBadge">{{ cursorLabel }}</span>
    </div>
  `,
  styleUrls: ['./custom-cursor.component.css']
})
export class CustomCursorComponent implements OnInit, OnDestroy {
  private cdr = inject(ChangeDetectorRef);

  enabled = false;
  isHovered = false;
  isActive = false;
  cursorLabel = '';

  private x = -100;
  private y = -100;
  private targetX = -100;
  private targetY = -100;
  private animFrameId: number | null = null;

  get cursorTransform(): string {
    return `translate3d(${this.x}px, ${this.y}px, 0)`;
  }

  ngOnInit(): void {
    if (typeof window === 'undefined') return;

    // Disable on touch devices or if user prefers reduced motion
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isTouch && !reducedMotion) {
      this.enabled = true;
      this.startLoop();
    }
  }

  ngOnDestroy(): void {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    if (!this.enabled) return;
    this.targetX = e.clientX;
    this.targetY = e.clientY;

    const target = e.target as HTMLElement | null;
    if (!target) return;

    const interactiveEl = target.closest<HTMLElement>(
      'a, button, [role="button"], input, textarea, select, [data-cursor]'
    );

    if (interactiveEl) {
      this.isHovered = true;
      this.cursorLabel = interactiveEl.getAttribute('data-cursor') || '';
    } else {
      this.isHovered = false;
      this.cursorLabel = '';
    }
  }

  @HostListener('document:mousedown')
  onMouseDown(): void {
    this.isActive = true;
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    this.isActive = false;
  }

  private startLoop(): void {
    const loop = () => {
      // Smooth lerp follow
      this.x += (this.targetX - this.x) * 0.2;
      this.y += (this.targetY - this.y) * 0.2;

      this.cdr.markForCheck();
      this.animFrameId = requestAnimationFrame(loop);
    };
    loop();
  }
}
