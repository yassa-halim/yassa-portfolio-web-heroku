import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../core/services/data.service';
import { ScrollService } from '../../core/services/scroll.service';
import { NavLink, SiteConfig } from '../../core/models/site-config.model';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  get config(): SiteConfig { return this.dataService.siteConfig; }
  get navLinks(): NavLink[] { return this.config?.navLinks || []; }
  currentYear = new Date().getFullYear();

  constructor(
    private dataService: DataService,
    private scrollService: ScrollService
  ) {}

  ngOnInit(): void {}

  navigate(href: string): void {
    this.scrollService.scrollToHref(href);
  }

  trackByHref(_: number, link: NavLink): string { return link.href; }
}
