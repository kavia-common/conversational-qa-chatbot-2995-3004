import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionResponse } from '../../models';

/**
 * PUBLIC_INTERFACE
 * SidebarComponent displays the list of chat sessions and session actions.
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() sessions: SessionResponse[] = [];
  @Input() activeSessionId: string | null = null;
  @Input() loading = false;
  @Output() select = new EventEmitter<SessionResponse>();
  @Output() create = new EventEmitter<void>();
  @Output() remove = new EventEmitter<SessionResponse>();

  trackById = (_: number, s: SessionResponse) => s.session_id;
}
