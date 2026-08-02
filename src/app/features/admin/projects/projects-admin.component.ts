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
  uploadLoading = false;
  uploadError = '';
  saveLoading = false;

  formProject: Partial<Project> = this.blankForm();
  techInput = '';
  featureInput = '';

  constructor(public dataService: DataService) {}

  private blankForm(): Partial<Project> {
    return {
      title: '',
      subtitle: '',
      category: 'Mobile App',
      description: '',
      coverImage: '',
      techStack: [],
      features: [],
      challenges: '',
      solutions: '',
      githubUrl: '',
      liveUrl: '',
      status: 'published',
      accentColor: '#A55B4B',
    };
  }

  openAddModal(): void {
    this.editingId = null;
    this.formProject = this.blankForm();
    this.techInput = 'Flutter, Dart, Firebase';
    this.featureInput = 'Real-time sync, Custom animations';
    this.uploadError = '';
    this.showModal = true;
  }

  openEditModal(project: Project): void {
    this.editingId = project.id;
    this.formProject = { ...project };
    this.techInput = project.techStack.join(', ');
    this.featureInput = project.features.join(', ');
    this.uploadError = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.uploadError = '';
  }

  /** Called when user picks a file from the <input type="file"> */
  async onImageSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.uploadError = 'Image must be smaller than 5MB';
      return;
    }

    this.uploadLoading = true;
    this.uploadError = '';

    try {
      const url = await this.dataService.uploadImage(file);
      this.formProject = { ...this.formProject, coverImage: url };
    } catch (err: any) {
      this.uploadError = err?.error?.message || 'Upload failed — please try again';
    } finally {
      this.uploadLoading = false;
      // Reset the file input so the same file can be re-selected if needed
      input.value = '';
    }
  }

  clearImage(): void {
    this.formProject = { ...this.formProject, coverImage: '' };
  }

  async saveProject(): Promise<void> {
    if (!this.formProject.title || !this.formProject.description) return;

    const techStack = this.techInput.split(',').map(s => s.trim()).filter(Boolean);
    const features = this.featureInput.split(',').map(s => s.trim()).filter(Boolean);

    const projectData = {
      ...this.formProject,
      techStack,
      features,
      slug: (this.formProject.title || '').toLowerCase().replace(/\s+/g, '-'),
    } as Project;

    this.saveLoading = true;
    try {
      if (this.editingId) {
        await this.dataService.updateProject(this.editingId, projectData);
      } else {
        await this.dataService.addProject(projectData);
      }
      this.closeModal();
    } finally {
      this.saveLoading = false;
    }
  }

  deleteProject(id: string): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.dataService.deleteProject(id);
    }
  }
}
