import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { ContactService, ContactForm } from '../../core/services/contact.service';
import { SiteConfig } from '../../core/models/site-config.model';

type SubmitState = 'idle' | 'sending' | 'compiling' | 'success' | 'error';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit {
  get config(): SiteConfig { return this.dataService.siteConfig; }

  formData: ContactForm = {
    name: '',
    email: '',
    subject: '',
    body: '',
  };

  submitState: SubmitState = 'idle';
  focusedField: string | null = null;

  constructor(
    private dataService: DataService,
    private contactService: ContactService
  ) {}

  ngOnInit(): void {}

  setFocus(field: string | null): void {
    this.focusedField = field;
  }

  isFocusedOrFilled(field: keyof ContactForm): boolean {
    return this.focusedField === field || !!this.formData[field];
  }

  onSubmit(): void {
    if (this.submitState !== 'idle') return;

    if (!this.formData.name || !this.formData.email || !this.formData.body) {
      return;
    }

    this.submitState = 'sending';

    setTimeout(() => {
      this.submitState = 'compiling';

      this.contactService.send(this.formData).subscribe({
        next: () => {
          // Update local state on success
          this.dataService.messagesSignal.update(msgs => [
            { id: Date.now().toString(), ...this.formData, read: false, createdAt: new Date().toISOString() },
            ...msgs
          ]);
          this.submitState = 'success';
          setTimeout(() => {
            this.submitState = 'idle';
            this.formData = { name: '', email: '', subject: '', body: '' };
          }, 3000);
        },
        error: () => {
          this.submitState = 'error';
          setTimeout(() => {
            this.submitState = 'idle';
          }, 4000);
        },
      });
    }, 600);
  }
}
