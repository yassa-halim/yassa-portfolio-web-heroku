import { Component, OnInit, OnDestroy, HostListener, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { ScrollService } from '../../core/services/scroll.service';
import { Project, Skill, Course, Award } from '../../core/models/site-config.model';
import { Subscription } from 'rxjs';

export interface CommandItem {
  id: string;
  title: string;
  category: 'Project' | 'Skill' | 'Course' | 'Award' | 'Navigation';
  icon: string;
  action: () => void;
}

@Component({
  selector: 'app-command-palette',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './command-palette.component.html',
  styleUrls: ['./command-palette.component.css']
})
export class CommandPaletteComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  private scrollService = inject(ScrollService);
  private cdr = inject(ChangeDetectorRef);
  private sub!: Subscription;

  isOpen = false;
  searchQuery = '';
  selectedIndex = 0;

  get allCommands(): CommandItem[] {
    const items: CommandItem[] = [];

    // Nav links
    const navs = this.dataService.siteConfig.navLinks || [];
    navs.forEach(link => {
      items.push({
        id: `nav-${link.href}`,
        title: `Go to ${link.label}`,
        category: 'Navigation',
        icon: '📌',
        action: () => this.scrollService.scrollToHref(link.href)
      });
    });

    // Projects
    this.dataService.projects.forEach(p => {
      items.push({
        id: `proj-${p.id}`,
        title: p.title,
        category: 'Project',
        icon: '📱',
        action: () => this.scrollService.scrollToHref('#projects')
      });
    });

    // Skills
    this.dataService.skills.forEach(s => {
      items.push({
        id: `skill-${s.id}`,
        title: s.name,
        category: 'Skill',
        icon: '💎',
        action: () => this.scrollService.scrollToHref('#skills')
      });
    });

    // Courses
    this.dataService.courses.forEach(c => {
      items.push({
        id: `course-${c.id}`,
        title: c.title,
        category: 'Course',
        icon: '📜',
        action: () => this.scrollService.scrollToHref('#courses')
      });
    });

    // Awards
    this.dataService.awards.forEach(a => {
      items.push({
        id: `award-${a.id}`,
        title: a.title,
        category: 'Award',
        icon: '🏆',
        action: () => this.scrollService.scrollToHref('#awards')
      });
    });

    return items;
  }

  get filteredCommands(): CommandItem[] {
    if (!this.searchQuery.trim()) return this.allCommands.slice(0, 10);
    const query = this.searchQuery.toLowerCase();
    return this.allCommands.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    ).slice(0, 10);
  }

  ngOnInit(): void {
    this.sub = this.scrollService.commandPaletteOpen.subscribe(() => {
      this.open();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  open(): void {
    this.isOpen = true;
    this.searchQuery = '';
    this.selectedIndex = 0;
    this.cdr.markForCheck();
  }

  close(): void {
    this.isOpen = false;
    this.cdr.markForCheck();
  }

  execute(item: CommandItem): void {
    item.action();
    this.close();
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent): void {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      this.isOpen ? this.close() : this.open();
    } else if (this.isOpen) {
      if (e.key === 'Escape') {
        this.close();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.selectedIndex = (this.selectedIndex + 1) % Math.max(1, this.filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.selectedIndex = (this.selectedIndex - 1 + this.filteredCommands.length) % Math.max(1, this.filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = this.filteredCommands[this.selectedIndex];
        if (selected) this.execute(selected);
      }
    }
  }
}
