import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, throwError, timeout } from 'rxjs';
import {
  HealthResponse,
  ListMessagesResponse,
  SendMessageRequest,
  SendMessageResponse,
  SessionCreateRequest,
  SessionResponse
} from '../models';
import { environment } from '../../environments/environment';

/**
 * PUBLIC_INTERFACE
 * ApiService provides typed methods to interact with the backend REST API.
 * It wraps HTTP requests and exposes strongly typed observables with basic error handling.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl.replace(/\/+$/, '');

  private apiUrl(path: string): string {
    const p = path.startsWith('/') ? path : `/${path}`;
    return `${this.baseUrl}${p}`;
  }

  health(): Observable<HealthResponse> {
    return this.http.get<HealthResponse>(this.apiUrl('/')).pipe(
      timeout(15000),
      catchError(this.handleError),
    );
  }

  createSession(req: SessionCreateRequest): Observable<SessionResponse> {
    return this.http.post<SessionResponse>(this.apiUrl('/sessions'), req).pipe(
      timeout(30000),
      catchError(this.handleError),
    );
  }

  listSessions(skip = 0, limit = 50): Observable<SessionResponse[]> {
    const params = new HttpParams().set('skip', skip).set('limit', limit);
    return this.http.get<SessionResponse[]>(this.apiUrl('/sessions'), { params }).pipe(
      timeout(30000),
      catchError(this.handleError),
    );
  }

  getSession(sessionId: string): Observable<SessionResponse> {
    return this.http.get<SessionResponse>(this.apiUrl(`/sessions/${encodeURIComponent(sessionId)}`)).pipe(
      timeout(30000),
      catchError(this.handleError),
    );
  }

  deleteSession(sessionId: string): Observable<any> {
    return this.http.delete(this.apiUrl(`/sessions/${encodeURIComponent(sessionId)}`)).pipe(
      timeout(30000),
      catchError(this.handleError),
    );
  }

  listMessages(sessionId: string): Observable<ListMessagesResponse> {
    const params = new HttpParams().set('session_id', sessionId);
    return this.http.get<ListMessagesResponse>(this.apiUrl('/messages'), { params }).pipe(
      timeout(30000),
      catchError(this.handleError),
    );
  }

  sendMessage(payload: SendMessageRequest): Observable<SendMessageResponse> {
    return this.http.post<SendMessageResponse>(this.apiUrl('/messages'), payload).pipe(
      timeout(60000),
      catchError(this.handleError),
    );
  }

  private handleError(err: HttpErrorResponse) {
    let message = 'An unexpected error occurred.';
    // Avoid instanceof ErrorEvent to support SSR/lint; check by shape
    if (err.error && typeof err.error === 'object' && 'message' in err.error && typeof err.error.message === 'string') {
      message = (err.error as any).message as string;
    } else if (typeof err.error === 'string') {
      message = err.error;
    } else if (err.error?.detail) {
      try {
        if (Array.isArray(err.error.detail) && err.error.detail.length) {
          message = err.error.detail.map((d: any) => d.msg).join('; ');
        } else if (typeof err.error.detail === 'string') {
          message = err.error.detail;
        }
      } catch {
        // ignore
      }
    } else if (err.message) {
      message = err.message;
    }
    return throwError(() => new Error(message));
  }
}
