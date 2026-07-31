import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  delay: number;
  duration: number;
}

@Component({
  selector: 'app-starry-background',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './starry-background.component.html',
  styleUrls: ['./starry-background.component.css'],
})
export class StarryBackgroundComponent implements OnInit {
  stars: Star[] = [];

  ngOnInit(): void {
    this.stars = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.6 + 0.1,
      delay: Math.random() * 6,
      duration: Math.random() * 4 + 3,
    }));
  }

  trackById(_: number, star: Star): number { return star.id; }
}
