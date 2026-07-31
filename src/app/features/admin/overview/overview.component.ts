import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataService, ContactMessage } from '../../../core/services/data.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
})
export class OverviewComponent implements OnInit {
  private http = inject(HttpClient);

  analytics = {
    pageViews: 0,
    cvDownloads: 0,
    projectClicks: 0,
  };

  constructor(public dataService: DataService) {}

  ngOnInit(): void {
    this.fetchAnalyticsSummary();
  }

  fetchAnalyticsSummary(): void {
    this.http.get<{ pageViews: number; cvDownloads: number; projectClicks: number }>(
      `${environment.apiUrl}/analytics/summary`
    ).subscribe({
      next: (data) => {
        if (data) this.analytics = data;
      },
      error: () => {}
    });
  }

  get totalProjects(): number { return this.dataService.projects.length; }
  get totalSkills(): number { return this.dataService.skills.length; }
  get totalMessages(): number { return this.dataService.messagesSignal().length; }
  get unreadMessages(): number { return this.dataService.messagesSignal().filter(m => !m.read).length; }
  get totalCourses(): number { return this.dataService.courses.length; }

  toggleRead(id: string): void {
    this.dataService.toggleMessageRead(id);
  }

  deleteMsg(id: string): void {
    this.dataService.deleteMessage(id);
  }
}
