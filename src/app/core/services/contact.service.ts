import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  // Using Formspree — replace YOUR_FORM_ID with actual ID from formspree.io
  private readonly endpoint = 'https://formspree.io/f/YOUR_FORM_ID';

  constructor(private http: HttpClient) {}

  send(form: ContactForm): Observable<any> {
    return this.http.post(this.endpoint, form).pipe(
      catchError(err => throwError(() => err))
    );
  }
}
