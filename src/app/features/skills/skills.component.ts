import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { Skill } from '../../core/models/site-config.model';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css'],
})
export class SkillsComponent implements OnInit {
  get skills(): Skill[] { return this.dataService.skills; }
  activeFilter = 'All';
  searchQuery = '';

  get categories(): string[] {
    return ['All', ...Array.from(new Set(this.skills.map(s => s.category)))];
  }

  constructor(private dataService: DataService) {}

  ngOnInit(): void {}

  get filteredSkills(): Skill[] {
    return this.skills.filter(s => {
      const matchFilter = this.activeFilter === 'All' || s.category === this.activeFilter;
      const matchSearch = s.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchFilter && matchSearch;
    });
  }

  get pyramidRows(): Skill[][] {
    const rows: Skill[][] = [];
    let itemsPerRow = 1;
    let index = 0;
    const fs = this.filteredSkills;
    while (index < fs.length) {
      rows.push(fs.slice(index, index + itemsPerRow));
      index += itemsPerRow;
      itemsPerRow++;
    }
    return rows.reverse();
  }

  isImage(icon: string): boolean {
    return icon.startsWith('/') || icon.startsWith('http');
  }

  trackById(_: number, skill: Skill): string { return skill.id; }
  trackByRow(i: number): number { return i; }
}
