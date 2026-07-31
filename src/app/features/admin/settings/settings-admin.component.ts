import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { DataService } from '../../../core/services/data.service';
import { SiteConfig } from '../../../core/models/site-config.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-settings-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings-admin.component.html',
  styleUrls: ['./settings-admin.component.css'],
})
export class SettingsAdminComponent implements OnInit {
  private http = inject(HttpClient);
  config!: SiteConfig;
  saved = false;

  // Change Password state
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';
  passwordMsg = '';
  passwordError = '';
  isSubmittingPassword = false;

  constructor(public dataService: DataService) {}

  ngOnInit(): void {
    this.config = JSON.parse(JSON.stringify(this.dataService.siteConfig));
  }

  saveSettings(): void {
    this.dataService.saveSiteConfig(this.config);
    this.saved = true;
    setTimeout(() => this.saved = false, 3000);
  }

  async changePassword(): Promise<void> {
    this.passwordMsg = '';
    this.passwordError = '';

    if (!this.oldPassword || !this.newPassword) {
      this.passwordError = 'Please fill in both current and new password.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.passwordError = 'New password and confirmation do not match.';
      return;
    }

    if (this.newPassword.length < 6) {
      this.passwordError = 'New password must be at least 6 characters.';
      return;
    }

    this.isSubmittingPassword = true;

    try {
      const res = await firstValueFrom(
        this.http.post<{ success: boolean; message: string }>(
          `${environment.apiUrl}/auth/change-password`,
          { oldPassword: this.oldPassword, newPassword: this.newPassword }
        )
      );
      this.passwordMsg = res.message || 'Password updated successfully!';
      this.oldPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
    } catch (err: any) {
      this.passwordError = err.error?.message || 'Failed to update password.';
    } finally {
      this.isSubmittingPassword = false;
    }
  }
}
