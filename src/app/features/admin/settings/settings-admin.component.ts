import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../core/services/data.service';
import { SiteConfig } from '../../../core/models/site-config.model';

@Component({
  selector: 'app-settings-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings-admin.component.html',
  styleUrls: ['./settings-admin.component.css'],
})
export class SettingsAdminComponent implements OnInit {
  config!: SiteConfig;
  saved = false;

  constructor(public dataService: DataService) {}

  ngOnInit(): void {
    this.config = JSON.parse(JSON.stringify(this.dataService.siteConfig));
  }

  saveSettings(): void {
    this.dataService.saveSiteConfig(this.config);
    this.saved = true;
    setTimeout(() => this.saved = false, 3000);
  }
}
