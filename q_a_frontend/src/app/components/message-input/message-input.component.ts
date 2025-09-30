import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * PUBLIC_INTERFACE
 * MessageInputComponent renders the bottom input with send action and loading state.
 */
@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.css']
})
export class MessageInputComponent {
  @Input() disabled = false;
  @Input() sending = false;
  @Output() send = new EventEmitter<string>();

  text = '';

  onSend() {
    const t = this.text.trim();
    if (!t || this.disabled || this.sending) return;
    this.send.emit(t);
    this.text = '';
  }

  onKeydown(e: { key?: string; keyCode?: number; shiftKey?: boolean; preventDefault: () => void }) {
    const key = e.key ?? '';
    const keyCode = e.keyCode ?? 0;
    const shift = !!e.shiftKey;
    if ((key === 'Enter' || keyCode === 13) && !shift) {
      e.preventDefault();
      this.onSend();
    }
  }
}
