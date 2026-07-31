import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../core/services/data.service';
import { Course, Award } from '../../../core/models/site-config.model';

@Component({
  selector: 'app-credentials-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './credentials-admin.component.html',
  styleUrls: ['./credentials-admin.component.css'],
})
export class CredentialsAdminComponent {
  activeTab: 'courses' | 'awards' = 'courses';

  showCourseModal = false;
  formCourse: Partial<Course> = { title: '', provider: '', hours: 20, certificateUrl: '#', completedAt: '2025-01-01' };

  showAwardModal = false;
  formAward: Partial<Award> = { title: '', issuer: '', description: '', date: '2025-01-01', icon: '🏆' };

  constructor(public dataService: DataService) {}

  openAddCourse(): void {
    this.formCourse = { title: '', provider: '', hours: 20, certificateUrl: '#', completedAt: '2025-01-01' };
    this.showCourseModal = true;
  }

  saveCourse(): void {
    if (!this.formCourse.title) return;
    this.dataService.addCourse(this.formCourse as Course);
    this.showCourseModal = false;
  }

  deleteCourse(id: string): void {
    if (confirm('Delete this course?')) {
      this.dataService.deleteCourse(id);
    }
  }

  openAddAward(): void {
    this.formAward = { title: '', issuer: '', description: '', date: '2025-01-01', icon: '🏆' };
    this.showAwardModal = true;
  }

  saveAward(): void {
    if (!this.formAward.title) return;
    this.dataService.addAward(this.formAward as Award);
    this.showAwardModal = false;
  }

  deleteAward(id: string): void {
    if (confirm('Delete this award?')) {
      this.dataService.deleteAward(id);
    }
  }
}
