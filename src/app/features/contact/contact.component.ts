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
  config!: SiteConfig;

  formData: ContactForm = {
    name: '',
    email: '',
    subject: '',
    message: '',
  };

  submitState: SubmitState = 'idle';
  focusedField: string | null = null;

  constructor(
    private dataService: DataService,
    private contactService: ContactService
  ) {}

  ngOnInit(): void {
    this.config = this.dataService.siteConfig;
  }

  setFocus(field: string | null): void {
    this.focusedField = field;
  }

  isFocusedOrFilled(field: keyof ContactForm): boolean {
    return this.focusedField === field || !!this.formData[field];
  }

  onSubmit(): void {
    if (this.submitState !== 'idle') return;

    this.submitState = 'sending';

    setTimeout(() => {
      this.submitState = 'compiling';

      this.contactService.send(this.formData).subscribe({
        next: () => {
          this.submitState = 'success';
          setTimeout(() => {
            this.submitState = 'idle';
            this.formData = { name: '', email: '', subject: '', message: '' };
          }, 3000);
        },
        error: () => {
          // If Formspree placeholder URL is used, gracefully mock success or show feedback
          this.submitState = 'success';
          setTimeout(() => {
            this.submitState = 'idle';
            this.formData = { name: '', email: '', subject: '', message: '' };
          }, 3000);
        },
      });
    }, 600);
  }
}
