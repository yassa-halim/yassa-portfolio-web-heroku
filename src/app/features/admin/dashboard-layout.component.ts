import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css'],
})
export class DashboardLayoutComponent implements OnInit {
  menuItems = [
    { label: 'Overview', icon: '📊', path: '/admin/overview' },
    { label: 'Projects', icon: '🚀', path: '/admin/projects' },
    { label: 'Skills', icon: '💎', path: '/admin/skills' },
    { label: 'Credentials', icon: '📜', path: '/admin/credentials' },
    { label: 'Messages', icon: '💬', path: '/admin/messages' },
    { label: 'Media', icon: '🖼️', path: '/admin/media' },
    { label: 'Settings', icon: '⚙️', path: '/admin/settings' },
    { label: 'SEO', icon: '🔍', path: '/admin/seo' },
  ];

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/admin/login']);
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}
