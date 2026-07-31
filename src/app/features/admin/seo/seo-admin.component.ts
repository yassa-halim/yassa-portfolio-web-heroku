import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, SeoSetting } from '../../../core/services/data.service';

@Component({
  selector: 'app-seo-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './seo-admin.component.html',
  styleUrls: ['./seo-admin.component.css'],
})
export class SeoAdminComponent {
  savedId: string | null = null;

  constructor(public dataService: DataService) {}

  saveSeo(s: SeoSetting): void {
    this.dataService.updateSeo(s.id, s);
    this.savedId = s.id;
    setTimeout(() => this.savedId = null, 2500);
  }
}
