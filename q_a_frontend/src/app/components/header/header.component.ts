import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

/**
 * PUBLIC_INTERFACE
 * HeaderComponent renders the top bar with app title and status.
 * Displays a link to backend API docs using the configured base URL for quick verification.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() title = 'Q&A Chatbot';
  theme = environment.theme;

  /** PUBLIC_INTERFACE
   * apiBaseUrl currently configured in the frontend environment.
   */
  get apiBaseUrl(): string {
    return environment.apiBaseUrl;
  }

  /** PUBLIC_INTERFACE
   * Derived link to the backend docs page for manual verification.
   */
  get apiDocsHref(): string {
    try {
      const base = environment.apiBaseUrl.replace(/\/+$/, '');
      return `${base}/docs`;
    } catch {
      return '#';
    }
  }
}
