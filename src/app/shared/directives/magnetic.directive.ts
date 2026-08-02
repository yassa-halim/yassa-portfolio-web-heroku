import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appMagnetic]',
  standalone: true
})
export class MagneticDirective implements OnInit {
  @Input() magneticDistance = 60;
  @Input() magneticStrength = 0.3;

  private enabled = true;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    if (typeof window === 'undefined') return;

    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouch || reducedMotion) {
      this.enabled = false;
    } else {
      this.el.nativeElement.style.transition = 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    if (!this.enabled) return;

    const rect = this.el.nativeElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    const distance = Math.hypot(distanceX, distanceY);

    if (distance < this.magneticDistance) {
      const moveX = distanceX * this.magneticStrength;
      const moveY = distanceY * this.magneticStrength;
      this.el.nativeElement.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
    } else {
      this.resetPosition();
    }
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.resetPosition();
  }

  private resetPosition(): void {
    if (!this.enabled) return;
    this.el.nativeElement.style.transform = 'translate3d(0, 0, 0)';
  }
}
