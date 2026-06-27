import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VoiceService {
  private readonly apiUrl: string;

  private normalizeBaseUrl(base: string): string {
    // remove trailing slash
    if (base.endsWith('/')) base = base.slice(0, -1);
    // if base already includes /api at the end, don't append another
    if (base.endsWith('/api')) return `${base}/chat`;
    if (base.endsWith('/api/')) return `${base}chat`;
    return `${base}/api/chat`;
  }

  constructor(private http: HttpClient) {
    this.apiUrl = this.normalizeBaseUrl(environment.apiBaseUrl);
  }

  sendMessage(message: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.http.post<any>(
      this.apiUrl,
      { message },
      { headers }
    );
  }

  sendTranscript(message: string): Observable<{ reply: string }> {
    return this.http.post<{ reply: string }>(this.apiUrl, { message });
  }
}