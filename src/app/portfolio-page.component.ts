import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

import { SplashScreenComponent } from './shared/splash-screen/splash-screen.component';
import { StarryBackgroundComponent } from './shared/starry-background/starry-background.component';
import { CustomCursorComponent } from './shared/custom-cursor/custom-cursor.component';
import { ScrollProgressComponent } from './shared/scroll-progress/scroll-progress.component';
import { NavigationComponent } from './shared/navigation/navigation.component';
import { CommandPaletteComponent } from './shared/command-palette/command-palette.component';
import { FooterComponent } from './shared/footer/footer.component';
import { ResumeModalComponent } from './shared/resume-modal/resume-modal.component';

import { HeroComponent } from './features/hero/hero.component';
import { AboutComponent } from './features/about/about.component';
import { SkillsComponent } from './features/skills/skills.component';
import { ProjectsComponent } from './features/projects/projects.component';
import { CredentialsComponent } from './features/credentials/credentials.component';
import { ContactComponent } from './features/contact/contact.component';

@Component({
  selector: 'app-portfolio-page',
  standalone: true,
  imports: [
    CommonModule,
    SplashScreenComponent,
    StarryBackgroundComponent,
    CustomCursorComponent,
    ScrollProgressComponent,
    NavigationComponent,
    CommandPaletteComponent,
    FooterComponent,
    ResumeModalComponent,
    HeroComponent,
    AboutComponent,
    SkillsComponent,
    ProjectsComponent,
    CredentialsComponent,
    ContactComponent,
  ],
  template: `
    <!-- Backgrounds & Loaders -->
    <app-starry-background></app-starry-background>
    <app-splash-screen></app-splash-screen>
    <app-custom-cursor></app-custom-cursor>
    <app-scroll-progress></app-scroll-progress>

    <!-- Navigation & Command Palette -->
    <app-navigation></app-navigation>
    <app-command-palette></app-command-palette>

    <!-- Main Sections -->
    <main>
      <app-hero (openResume)="showResumeModal = true"></app-hero>
      <app-about></app-about>
      <app-skills></app-skills>
      <app-projects></app-projects>
      <app-credentials></app-credentials>
      <app-contact></app-contact>
    </main>

    <!-- Footer -->
    <app-footer></app-footer>

    <!-- Resume Modal -->
    <app-resume-modal
      [isOpen]="showResumeModal"
      (close)="showResumeModal = false">
    </app-resume-modal>

    <!-- Global Noise Overlay -->
    <div class="noise-overlay" aria-hidden="true"></div>
  `,
  styles: [`
    main {
      position: relative;
      z-index: 1;
    }
  `]
})
export class PortfolioPageComponent implements OnInit {
  private http = inject(HttpClient);
  showResumeModal = false;

  ngOnInit(): void {
    // Track page view event
    this.http.post(`${environment.apiUrl}/analytics/track`, { type: 'page_view' }).subscribe({
      error: () => {}
    });
  }
}
