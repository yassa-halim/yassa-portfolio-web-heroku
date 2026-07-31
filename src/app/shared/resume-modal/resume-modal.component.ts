import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resume-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop" *ngIf="isOpen" (click)="closeModal()">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="modal-header">
          <div class="title-group">
            <span class="badge">📄 CV Preview</span>
            <h3>Yassa Halim Said — Resume</h3>
          </div>
          <div class="actions">
            <a href="/resume.pdf" download="Yassa_Halim_Resume.pdf" class="btn btn-download">
              ⬇ Download PDF
            </a>
            <button class="close-btn" (click)="closeModal()" aria-label="Close">✕</button>
          </div>
        </div>

        <!-- Body / PDF Viewer -->
        <div class="modal-body">
          <iframe
            src="/resume.pdf#toolbar=0&navpanes=0"
            title="Yassa Halim Resume PDF"
            width="100%"
            height="100%">
          </iframe>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      animation: fadeIn 0.25s ease-out;
    }

    .modal-card {
      width: 100%;
      max-width: 900px;
      height: 85vh;
      background: rgba(18, 18, 26, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.03);
    }

    .title-group {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;

      .badge {
        font-size: 0.75rem;
        color: var(--primary-color, #00E5FF);
        font-weight: 600;
      }

      h3 {
        margin: 0;
        font-size: 1.2rem;
        color: #fff;
      }
    }

    .actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .btn-download {
      padding: 0.6rem 1.2rem;
      background: var(--primary-gradient, linear-gradient(135deg, #00E5FF, #0088FF));
      color: #000;
      font-weight: 600;
      font-size: 0.85rem;
      border-radius: 8px;
      text-decoration: none;
      transition: transform 0.2s, box-shadow 0.2s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px var(--primary-glow, rgba(0, 229, 255, 0.4));
      }
    }

    .close-btn {
      background: rgba(255, 255, 255, 0.1);
      border: none;
      color: #fff;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 1.1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }
    }

    .modal-body {
      flex: 1;
      background: #1e1e1e;
      iframe {
        border: none;
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.96); }
      to { opacity: 1; transform: scale(1); }
    }
  `]
})
export class ResumeModalComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  closeModal(): void {
    this.close.emit();
  }
}
