import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../core/services/data.service';
import { Project } from '../../../core/models/site-config.model';

/** Max dimension for any side of a compressed image */
const MAX_PX = 1200;
/** JPEG quality (0–1) */
const JPEG_QUALITY = 0.82;

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

  /** Set of indices currently being processed (client-side, so near-instant) */
  processingSet = new Set<number | 'new'>();
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
    this.processingSet.clear();
    this.showModal = true;
  }

  openEditModal(project: Project): void {
    this.editingId = project.id;
    this.formProject = { ...project, images: [...(project.images || [])] };
    this.techInput = project.techStack.join(', ');
    this.featureInput = project.features.join(', ');
    this.uploadError = '';
    this.processingSet.clear();
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.uploadError = '';
    this.processingSet.clear();
  }

  triggerUpload(index: number | 'new'): void {
    const inputId = index === 'new' ? 'imgNew' : `img${index}`;
    (document.getElementById(inputId) as HTMLInputElement | null)?.click();
  }

  /** ─── CLIENT-SIDE MULTI-FILE HANDLER ─── */
  async onFilesSelected(event: Event, replaceIndex?: number): Promise<void> {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []);
    if (!files.length) return;

    this.uploadError = '';

    // Validate
    const tooLarge = files.find(f => f.size > 20 * 1024 * 1024);
    if (tooLarge) {
      this.uploadError = `"${tooLarge.name}" exceeds 20 MB — please resize first`;
      input.value = '';
      return;
    }

    // Show spinner per slot
    if (replaceIndex !== undefined) {
      this.processingSet.add(replaceIndex);
    } else {
      this.processingSet.add('new');
    }

    try {
      // Process all files in parallel (client-side canvas compression)
      const dataUrls = await Promise.all(files.map(f => this.compressToDataUrl(f)));

      const imgs = [...(this.formProject.images || [])];

      if (replaceIndex !== undefined) {
        // Replace single slot
        imgs[replaceIndex] = dataUrls[0];
      } else {
        // Append all
        imgs.push(...dataUrls);
      }

      this.formProject = {
        ...this.formProject,
        images: imgs,
        coverImage: imgs[0] || '',
      };
    } catch {
      this.uploadError = 'Could not process image — try a different file';
    } finally {
      if (replaceIndex !== undefined) {
        this.processingSet.delete(replaceIndex);
      } else {
        this.processingSet.delete('new');
      }
      input.value = '';
    }
  }

  /**
   * Compress a File to a base64 JPEG data URL using a canvas.
   * No server call — runs entirely in the browser. Instant.
   */
  private compressToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const { width, height } = img;
          const ratio = Math.min(MAX_PX / width, MAX_PX / height, 1);
          const w = Math.round(width * ratio);
          const h = Math.round(height * ratio);

          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY));
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
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

  isProcessing(index: number | 'new'): boolean {
    return this.processingSet.has(index);
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
