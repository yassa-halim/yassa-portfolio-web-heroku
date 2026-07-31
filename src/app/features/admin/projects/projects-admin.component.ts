import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../core/services/data.service';
import { Project } from '../../../core/models/site-config.model';

@Component({
  selector: 'app-projects-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './projects-admin.component.html',
  styleUrls: ['./projects-admin.component.css'],
})
export class ProjectsAdminComponent {
  showModal = false;
  editingId: string | null = null;

  formProject: Partial<Project> = {
    title: '',
    subtitle: '',
    category: 'Mobile App',
    description: '',
    coverImage: '/uploads/1783574845336-277703199-1.jpg',
    techStack: [],
    features: [],
    githubUrl: '',
    liveUrl: '',
    status: 'published',
  };

  techInput = '';
  featureInput = '';

  constructor(public dataService: DataService) {}

  openAddModal(): void {
    this.editingId = null;
    this.formProject = {
      title: '',
      subtitle: '',
      category: 'Mobile App',
      description: '',
      coverImage: '/uploads/1783574845336-277703199-1.jpg',
      techStack: ['Flutter', 'Dart', 'Firebase'],
      features: ['Real-time sync', 'Custom animations'],
      githubUrl: 'https://github.com/yassahalim/',
      liveUrl: '',
      status: 'published',
    };
    this.techInput = this.formProject.techStack?.join(', ') || '';
    this.featureInput = this.formProject.features?.join(', ') || '';
    this.showModal = true;
  }

  openEditModal(project: Project): void {
    this.editingId = project.id;
    this.formProject = { ...project };
    this.techInput = project.techStack.join(', ');
    this.featureInput = project.features.join(', ');
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveProject(): void {
    if (!this.formProject.title || !this.formProject.description) return;

    const techStack = this.techInput.split(',').map(s => s.trim()).filter(Boolean);
    const features = this.featureInput.split(',').map(s => s.trim()).filter(Boolean);

    const projectData = {
      ...this.formProject,
      techStack,
      features,
      slug: (this.formProject.title || '').toLowerCase().replace(/\s+/g, '-'),
    } as Project;

    if (this.editingId) {
      this.dataService.updateProject(this.editingId, projectData);
    } else {
      this.dataService.addProject(projectData);
    }

    this.closeModal();
  }

  deleteProject(id: string): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.dataService.deleteProject(id);
    }
  }
}
