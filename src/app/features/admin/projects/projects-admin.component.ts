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
  uploadingIndex: number | null = null; // which slot is uploading (-1 = new slot)
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
      images: [],
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
    this.formProject = { ...project, images: [...(project.images || [])] };
    this.techInput = project.techStack.join(', ');
    this.featureInput = project.features.join(', ');
    this.uploadError = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.uploadError = '';
    this.uploadingIndex = null;
  }

  /** Trigger hidden file input for a specific slot index, or -1 for adding new */
  triggerUpload(index: number): void {
    const inputId = index === -1 ? 'imgNew' : `img${index}`;
    const el = document.getElementById(inputId) as HTMLInputElement | null;
    el?.click();
  }

  /** Handles file selection — uploads and stores into images[] at given index or appends */
  async onImageSelected(event: Event, index: number): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      this.uploadError = 'Image must be smaller than 5MB';
      input.value = '';
      return;
    }

    this.uploadingIndex = index;
    this.uploadError = '';

    try {
      const url = await this.dataService.uploadImage(file);
      const imgs = [...(this.formProject.images || [])];

      if (index === -1) {
        // New image: append
        imgs.push(url);
      } else {
        // Replace existing
        imgs[index] = url;
      }

      // First image always becomes coverImage
      this.formProject = {
        ...this.formProject,
        images: imgs,
        coverImage: imgs[0] || '',
      };
    } catch (err: any) {
      this.uploadError = err?.error?.message || 'Upload failed — please try again';
    } finally {
      this.uploadingIndex = null;
      input.value = '';
    }
  }

  removeImage(index: number): void {
    const imgs = [...(this.formProject.images || [])];
    imgs.splice(index, 1);
    this.formProject = {
      ...this.formProject,
      images: imgs,
      coverImage: imgs[0] || '',
    };
  }

  setCover(index: number): void {
    const imgs = [...(this.formProject.images || [])];
    const [picked] = imgs.splice(index, 1);
    imgs.unshift(picked);
    this.formProject = { ...this.formProject, images: imgs, coverImage: picked };
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
