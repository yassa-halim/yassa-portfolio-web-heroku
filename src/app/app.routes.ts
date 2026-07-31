import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./portfolio-page.component').then(m => m.PortfolioPageComponent),
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./features/admin/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () => import('./features/admin/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () => import('./features/admin/overview/overview.component').then(m => m.OverviewComponent),
      },
      {
        path: 'projects',
        loadComponent: () => import('./features/admin/projects/projects-admin.component').then(m => m.ProjectsAdminComponent),
      },
      {
        path: 'skills',
        loadComponent: () => import('./features/admin/skills/skills-admin.component').then(m => m.SkillsAdminComponent),
      },
      {
        path: 'credentials',
        loadComponent: () => import('./features/admin/credentials/credentials-admin.component').then(m => m.CredentialsAdminComponent),
      },
      {
        path: 'messages',
        loadComponent: () => import('./features/admin/messages/messages-admin.component').then(m => m.MessagesAdminComponent),
      },
      {
        path: 'media',
        loadComponent: () => import('./features/admin/media/media-admin.component').then(m => m.MediaAdminComponent),
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/admin/settings/settings-admin.component').then(m => m.SettingsAdminComponent),
      },
      {
        path: 'seo',
        loadComponent: () => import('./features/admin/seo/seo-admin.component').then(m => m.SeoAdminComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
