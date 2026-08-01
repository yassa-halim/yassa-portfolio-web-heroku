import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  body: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private http = inject(HttpClient);
  private readonly endpoint = `${environment.apiUrl}/messages`;

  send(form: ContactForm): Observable<{ success: boolean; message: string }> {
    return this.http
      .post<{ success: boolean; message: string }>(this.endpoint, form)
      .pipe(catchError(err => throwError(() => err)));
  }
}
