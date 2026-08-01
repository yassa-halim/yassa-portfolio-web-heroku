import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private http = inject(HttpClient);

  /**
   * Track an analytics event. Silently ignores errors (fire-and-forget).
   */
  track(type: 'page_view' | 'cv_download' | 'project_click', target?: string): void {
    this.http
      .post(`${environment.apiUrl}/analytics/track`, { type, target })
      .subscribe({ error: () => {} });
  }
}
