import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ChatMessage } from '../../models';

/**
 * PUBLIC_INTERFACE
 * ChatAreaComponent displays the chat transcript with minimal styling and smooth transitions.
 */
@Component({
  selector: 'app-chat-area',
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe],
  templateUrl: './chat-area.component.html',
  styleUrls: ['./chat-area.component.css']
})
export class ChatAreaComponent {
  @Input() messages: ChatMessage[] = [];
  @Input() loading = false;
  @Input() typing = false;

  trackByIndex = (i: number) => i;
}
