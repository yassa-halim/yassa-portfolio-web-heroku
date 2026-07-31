import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, ContactMessage } from '../../../core/services/data.service';

@Component({
  selector: 'app-messages-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './messages-admin.component.html',
  styleUrls: ['./messages-admin.component.css'],
})
export class MessagesAdminComponent {
  selectedMsg: ContactMessage | null = null;

  constructor(public dataService: DataService) {}

  viewMsg(msg: ContactMessage): void {
    this.selectedMsg = msg;
    if (!msg.read) {
      this.dataService.toggleMessageRead(msg.id);
    }
  }

  toggleRead(id: string, e: Event): void {
    e.stopPropagation();
    this.dataService.toggleMessageRead(id);
  }

  deleteMsg(id: string, e?: Event): void {
    if (e) e.stopPropagation();
    if (confirm('Delete this message?')) {
      this.dataService.deleteMessage(id);
      if (this.selectedMsg?.id === id) {
        this.selectedMsg = null;
      }
    }
  }
}
