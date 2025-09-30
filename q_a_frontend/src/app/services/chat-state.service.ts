import { Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import {
  ChatMessage,
  ListMessagesResponse,
  SendMessageRequest,
  SendMessageResponse,
  SessionCreateRequest,
  SessionResponse
} from '../models';

/**
 * PUBLIC_INTERFACE
 * ChatStateService keeps application state for sessions and messages,
 * exposes signals for components, and orchestrates API interactions.
 */
@Injectable({ providedIn: 'root' })
export class ChatStateService {
  // Signals for reactivity in standalone components
  sessions = signal<SessionResponse[]>([]);
  activeSession = signal<SessionResponse | null>(null);
  messages = signal<ChatMessage[]>([]);
  loadingSessions = signal<boolean>(false);
  loadingMessages = signal<boolean>(false);
  sending = signal<boolean>(false);
  typing = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor(private api: ApiService) {}

  init = async () => {
    this.refreshSessions();
  };

  refreshSessions() {
    this.loadingSessions.set(true);
    this.error.set(null);
    this.api.listSessions().subscribe({
      next: (s) => {
        this.sessions.set(s);
        if (!this.activeSession()) {
          // select most recently updated if exists
          if (s.length) {
            const sorted = [...s].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
            this.setActiveSession(sorted[0]);
          } else {
            // no sessions yet, create one
            this.createSession({ title: 'New Chat' });
          }
        }
      },
      error: (e) => this.error.set(e.message || 'Failed to load sessions'),
      complete: () => this.loadingSessions.set(false),
    });
  }

  createSession(req: SessionCreateRequest) {
    this.error.set(null);
    this.api.createSession(req).subscribe({
      next: (session) => {
        this.sessions.set([session, ...this.sessions()]);
        this.setActiveSession(session);
      },
      error: (e) => this.error.set(e.message || 'Failed to create session'),
    });
  }

  deleteSession(session: SessionResponse) {
    this.error.set(null);
    this.api.deleteSession(session.session_id).subscribe({
      next: () => {
        const remaining = this.sessions().filter(s => s.session_id !== session.session_id);
        this.sessions.set(remaining);
        // If deleting current, switch to another or create new
        if (this.activeSession()?.session_id === session.session_id) {
          if (remaining.length) {
            this.setActiveSession(remaining[0]);
          } else {
            this.createSession({ title: 'New Chat' });
          }
        }
      },
      error: (e) => this.error.set(e.message || 'Failed to delete session'),
    });
  }

  setActiveSession(session: SessionResponse) {
    this.activeSession.set(session);
    this.loadMessages(session.session_id);
  }

  loadMessages(sessionId: string) {
    this.loadingMessages.set(true);
    this.error.set(null);
    this.api.listMessages(sessionId).subscribe({
      next: (resp: ListMessagesResponse) => {
        this.messages.set(resp.messages);
      },
      error: (e) => this.error.set(e.message || 'Failed to load messages'),
      complete: () => this.loadingMessages.set(false),
    });
  }

  sendMessage(text: string) {
    const session = this.activeSession();
    if (!session) {
      this.error.set('No active session.');
      return;
    }
    const trimmed = text.trim();
    if (!trimmed) return;

    const payload: SendMessageRequest = { session_id: session.session_id, message: trimmed };

    // Optimistic user message display
    const optimisticUser: ChatMessage = {
      role: 'user',
      content: trimmed,
      timestamp: new Date().toISOString(),
    };
    this.messages.set([...this.messages(), optimisticUser]);
    this.sending.set(true);
    this.typing.set(true);
    this.error.set(null);

    this.api.sendMessage(payload).subscribe({
      next: (resp: SendMessageResponse) => {
        // Replace optimistic user by leaving it (echo acceptable) and append assistant
        const assistant = resp.assistant_message;
        this.messages.set([...this.messages(), assistant]);
        // Update sessions metadata (message_count, updated_at)
        const updatedSessions = this.sessions().map(s =>
          s.session_id === resp.session_id
            ? { ...s, updated_at: new Date().toISOString(), message_count: resp.total_messages }
            : s
        );
        this.sessions.set(updatedSessions);
      },
      error: (e) => {
        // Rollback optimistic if desired. Here, keep it but show error.
        this.error.set(e.message || 'Failed to send message');
      },
      complete: () => {
        this.sending.set(false);
        this.typing.set(false);
      }
    });
  }
}
