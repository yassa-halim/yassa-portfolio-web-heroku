import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, MediaItem } from '../../../core/services/data.service';

@Component({
  selector: 'app-media-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './media-admin.component.html',
  styleUrls: ['./media-admin.component.css'],
})
export class MediaAdminComponent {
  copiedId: string | null = null;
  newUrl = '';

  constructor(public dataService: DataService) {}

  copyUrl(id: string, url: string): void {
    navigator.clipboard.writeText(url);
    this.copiedId = id;
    setTimeout(() => this.copiedId = null, 2000);
  }

  addMediaUrl(): void {
    if (!this.newUrl) return;
    const filename = this.newUrl.split('/').pop() || 'image.jpg';
    this.dataService.addMedia({
      name: filename,
      url: this.newUrl,
      folder: 'uploads',
      sizeKb: 200,
      uploadedAt: new Date().toISOString(),
    });
    this.newUrl = '';
  }

  deleteMedia(id: string): void {
    if (confirm('Delete this media file?')) {
      this.dataService.deleteMedia(id);
    }
  }
}
