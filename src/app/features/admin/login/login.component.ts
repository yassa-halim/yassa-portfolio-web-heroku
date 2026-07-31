import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  password = '';
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.error = '';
    this.loading = true;

    setTimeout(() => {
      const success = this.authService.login(this.password);
      this.loading = false;

      if (success) {
        this.router.navigate(['/admin/overview']);
      } else {
        this.error = 'Invalid admin password. (Try: admin123)';
      }
    }, 400);
  }
}
