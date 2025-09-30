import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ChatAreaComponent } from './components/chat-area/chat-area.component';
import { MessageInputComponent } from './components/message-input/message-input.component';
import { ChatStateService } from './services/chat-state.service';
import { SessionResponse } from './models';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    HeaderComponent,
    SidebarComponent,
    ChatAreaComponent,
    MessageInputComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private chat = inject(ChatStateService);
  theme = environment.theme;

  ngOnInit(): void {
    // Set CSS variables for theme gradient (guard for SSR/lint)
    const doc: any = typeof globalThis !== 'undefined' && (globalThis as any).document
      ? (globalThis as any).document
      : undefined;
    if (doc?.documentElement) {
      doc.documentElement.style.setProperty('--op-gradient', this.theme.gradient);
    }
    this.chat.init();
  }

  get sessions() { return this.chat.sessions(); }
  get active() { return this.chat.activeSession(); }
  get messages() { return this.chat.messages(); }
  get loadingSessions() { return this.chat.loadingSessions(); }
  get loadingMessages() { return this.chat.loadingMessages(); }
  get sending() { return this.chat.sending(); }
  get typing() { return this.chat.typing(); }
  get error() { return this.chat.error(); }

  onSelectSession(s: SessionResponse) { this.chat.setActiveSession(s); }
  onCreateSession() { this.chat.createSession({ title: 'New Chat' }); }
  onRemoveSession(s: SessionResponse) { this.chat.deleteSession(s); }
  onSendMessage(text: string) { this.chat.sendMessage(text); }
}
