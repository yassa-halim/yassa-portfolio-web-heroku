import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { ScrollService } from '../../core/services/scroll.service';
import { Subscription } from 'rxjs';

interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  action: () => void;
}

@Component({
  selector: 'app-command-palette',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './command-palette.component.html',
  styleUrls: ['./command-palette.component.css'],
})
export class CommandPaletteComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  isOpen = false;
  query = '';
  selectedIndex = 0;
  private sub!: Subscription;

  private allItems: SearchItem[] = [];
  results: SearchItem[] = [];
  grouped: Record<string, SearchItem[]> = {};

  constructor(
    private dataService: DataService,
    private scrollService: ScrollService
  ) {}

  ngOnInit(): void {
    // Listen for open command
    this.sub = this.scrollService.commandPaletteOpen.subscribe(() => {
      this.open();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private buildSearchIndex(): void {
    const nav = this.dataService.siteConfig.navLinks.map(link => ({
      id: `nav-${link.href}`,
      title: link.label,
      subtitle: 'Navigate to section',
      category: 'Navigation',
      action: () => this.scrollService.scrollToHref(link.href),
    }));

    const projects = this.dataService.projects.map(p => ({
      id: `proj-${p.id}`,
      title: p.title,
      subtitle: p.subtitle,
      category: 'Projects',
      action: () => this.scrollService.scrollTo('projects'),
    }));

    const skills = this.dataService.skills.map(s => ({
      id: `skill-${s.id}`,
      title: s.name,
      subtitle: `${s.category} — ${s.proficiency}%`,
      category: 'Skills',
      action: () => this.scrollService.scrollTo('skills'),
    }));

    const actions: SearchItem[] = [
      {
        id: 'action-cv',
        title: 'Download CV',
        subtitle: 'Download resume as PDF',
        category: 'Actions',
        action: () => window.open('/resume.pdf', '_blank'),
      },
      {
        id: 'action-contact',
        title: 'Send Message',
        subtitle: 'Open contact form',
        category: 'Actions',
        action: () => this.scrollService.scrollTo('contact'),
      },
    ];

    this.allItems = [...nav, ...projects, ...skills, ...actions];
  }

  open(): void {
    this.isOpen = true;
    this.query = '';
    this.selectedIndex = 0;
    this.buildSearchIndex();
    this.updateResults();
    setTimeout(() => this.searchInput?.nativeElement.focus(), 50);
  }

  close(): void {
    this.isOpen = false;
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent): void {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      this.isOpen ? this.close() : this.open();
    }
    if (e.key === 'Escape' && this.isOpen) this.close();
  }

  onInputKeyDown(e: KeyboardEvent): void {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.selectedIndex = Math.min(this.selectedIndex + 1, this.flatResults.length - 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
    } else if (e.key === 'Enter') {
      const item = this.flatResults[this.selectedIndex];
      if (item) { item.action(); this.close(); }
    }
  }

  onQueryChange(): void {
    this.selectedIndex = 0;
    this.updateResults();
  }

  private updateResults(): void {
    const q = this.query.trim().toLowerCase();
    const filtered = !q
      ? this.allItems.slice(0, 8)
      : this.allItems.filter(
          i => i.title.toLowerCase().includes(q) ||
               i.subtitle.toLowerCase().includes(q) ||
               i.category.toLowerCase().includes(q)
        );

    this.grouped = {};
    for (const item of filtered) {
      if (!this.grouped[item.category]) this.grouped[item.category] = [];
      this.grouped[item.category].push(item);
    }
    this.results = filtered;
  }

  get flatResults(): SearchItem[] { return this.results; }
  get groupEntries(): [string, SearchItem[]][] { return Object.entries(this.grouped); }

  getFlatIndex(cat: string, idx: number): number {
    let offset = 0;
    for (const [c, items] of Object.entries(this.grouped)) {
      if (c === cat) return offset + idx;
      offset += items.length;
    }
    return 0;
  }

  runAction(item: SearchItem): void {
    item.action();
    this.close();
  }

  trackByCategory(_: number, entry: [string, SearchItem[]]): string { return entry[0]; }
  trackById(_: number, item: SearchItem): string { return item.id; }
}
