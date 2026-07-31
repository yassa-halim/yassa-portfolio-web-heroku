import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-splash-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.css'],
})
export class SplashScreenComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);

  visible = true;
  hiding = false;

  ngOnInit(): void {
    setTimeout(() => {
      this.hiding = true;
      this.cdr.markForCheck();
      setTimeout(() => {
        this.visible = false;
        this.cdr.markForCheck();
      }, 500);
    }, 2000);
  }
}
