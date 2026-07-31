import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../core/services/data.service';
import { Skill } from '../../../core/models/site-config.model';

@Component({
  selector: 'app-skills-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './skills-admin.component.html',
  styleUrls: ['./skills-admin.component.css'],
})
export class SkillsAdminComponent {
  showModal = false;
  editingId: string | null = null;

  formSkill: Partial<Skill> = {
    name: '',
    category: 'Frontend',
    proficiency: 85,
    icon: '⚡',
  };

  categories = ['Frontend', 'Languages', 'Backend', 'Architecture', 'Tools'];

  constructor(public dataService: DataService) {}

  openAddModal(): void {
    this.editingId = null;
    this.formSkill = { name: '', category: 'Frontend', proficiency: 85, icon: '⚡' };
    this.showModal = true;
  }

  openEditModal(skill: Skill): void {
    this.editingId = skill.id;
    this.formSkill = { ...skill };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveSkill(): void {
    if (!this.formSkill.name) return;

    if (this.editingId) {
      this.dataService.updateSkill(this.editingId, this.formSkill);
    } else {
      this.dataService.addSkill(this.formSkill as Skill);
    }

    this.closeModal();
  }

  deleteSkill(id: string): void {
    if (confirm('Delete this skill?')) {
      this.dataService.deleteSkill(id);
    }
  }
}
