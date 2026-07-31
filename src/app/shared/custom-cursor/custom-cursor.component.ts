import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-cursor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-cursor.component.html',
  styleUrls: ['./custom-cursor.component.css'],
})
export class CustomCursorComponent implements OnInit, OnDestroy {
  @ViewChild('cursorRef') cursorRef!: ElementRef<HTMLDivElement>;
  @ViewChild('cursorDotRef') cursorDotRef!: ElementRef<HTMLDivElement>;

  label = '';
  isHovering = false;
  isTouch = true;

  private pos = { x: 0, y: 0 };
  private target = { x: 0, y: 0 };
  private rafId = 0;

  private mouseMoveHandler = (e: MouseEvent) => {
    this.target = { x: e.clientX, y: e.clientY };
  };

  private mouseOverHandler = (e: MouseEvent) => {
    const targetEl = e.target as HTMLElement;
    const interactive = targetEl.closest("a, button, input, textarea, select, [role='button']");
    if (interactive) {
      this.isHovering = true;
      const ariaLabel = interactive.getAttribute('aria-label');
      const tagName = interactive.tagName.toLowerCase();
      if (ariaLabel) {
        this.label = ariaLabel.length > 10 ? ariaLabel.slice(0, 10) : ariaLabel;
      } else if (tagName === 'a') {
        this.label = 'Open';
      } else if (tagName === 'button') {
        this.label = 'Click';
      } else if (tagName === 'input' || tagName === 'textarea') {
        this.label = 'Type';
      } else {
        this.label = 'View';
      }
    } else {
      this.isHovering = false;
      this.label = '';
    }
  };

  ngOnInit(): void {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    this.isTouch = isTouchDevice;

    if (!isTouchDevice) {
      document.body.classList.add('hide-native-cursor');
      window.addEventListener('mousemove', this.mouseMoveHandler, { passive: true });
      document.addEventListener('mouseover', this.mouseOverHandler, { passive: true });
      this.animate();
    }
  }

  ngOnDestroy(): void {
    document.body.classList.remove('hide-native-cursor');
    window.removeEventListener('mousemove', this.mouseMoveHandler);
    document.removeEventListener('mouseover', this.mouseOverHandler);
    cancelAnimationFrame(this.rafId);
  }

  private animate = () => {
    this.pos.x += (this.target.x - this.pos.x) * 0.15;
    this.pos.y += (this.target.y - this.pos.y) * 0.15;

    if (this.cursorRef?.nativeElement) {
      this.cursorRef.nativeElement.style.transform = `translate(${this.pos.x}px, ${this.pos.y}px)`;
    }
    if (this.cursorDotRef?.nativeElement) {
      this.cursorDotRef.nativeElement.style.transform = `translate(${this.target.x}px, ${this.target.y}px)`;
    }

    this.rafId = requestAnimationFrame(this.animate);
  };
}
