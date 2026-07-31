import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService, ContactMessage } from '../../../core/services/data.service';

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
})
export class OverviewComponent implements OnInit {
  constructor(public dataService: DataService) {}

  ngOnInit(): void {}

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
