import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from './core/services/analytics.service';

import { SplashScreenComponent } from './shared/splash-screen/splash-screen.component';
import { StarryBackgroundComponent } from './shared/starry-background/starry-background.component';
import { CustomCursorComponent } from './shared/custom-cursor/custom-cursor.component';
import { ScrollProgressComponent } from './shared/scroll-progress/scroll-progress.component';
import { NoiseOverlayComponent } from './shared/noise-overlay/noise-overlay.component';
import { NavigationComponent } from './shared/navigation/navigation.component';
import { CommandPaletteComponent } from './shared/command-palette/command-palette.component';
import { GithubHeatmapComponent } from './shared/github-heatmap/github-heatmap.component';
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
    NoiseOverlayComponent,
    NavigationComponent,
    CommandPaletteComponent,
    GithubHeatmapComponent,
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
    <app-noise-overlay></app-noise-overlay>
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
      
      <!-- GitHub Heatmap Section -->
      <section class="container" style="padding: 0 var(--space-6); position: relative; z-index: 2;">
        <app-github-heatmap></app-github-heatmap>
      </section>

      <app-projects></app-projects>
      <app-credentials></app-credentials>
      <app-contact></app-contact>
    </main>

    <!-- Footer -->
    <app-footer></app-footer>

    <!-- Resume Modal -->
    <app-resume-modal
      *ngIf="showResumeModal"
      (closeModal)="showResumeModal = false">
    </app-resume-modal>
  `,
  styles: [`
    main {
      position: relative;
      z-index: 1;
    }
  `]
})
export class PortfolioPageComponent implements OnInit {
  private analytics = inject(AnalyticsService);
  showResumeModal = false;

  ngOnInit(): void {
    this.analytics.track('page_view');
  }
}
