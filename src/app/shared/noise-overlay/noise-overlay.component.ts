import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-noise-overlay',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="noiseOverlay" aria-hidden="true"></div>`,
  styleUrls: ['./noise-overlay.component.css']
})
export class NoiseOverlayComponent {}
