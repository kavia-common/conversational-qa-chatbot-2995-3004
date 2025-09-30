export type Role = 'user' | 'assistant';

export interface ChatMessage {
  role: Role;
  content: string;
  timestamp: string; // ISO datetime
}

export interface SessionResponse {
  session_id: string;
  title: string;
  created_at: string; // ISO
  updated_at: string; // ISO
  message_count: number;
}

export interface SessionCreateRequest {
  title?: string | null;
}

export interface SendMessageRequest {
  session_id: string;
  message: string;
}

export interface SendMessageResponse {
  session_id: string;
  user_message: ChatMessage;
  assistant_message: ChatMessage;
  total_messages: number;
}

export interface ListMessagesResponse {
  session_id: string;
  messages: ChatMessage[];
}

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
}

export interface ApiErrorDetail {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail: ApiErrorDetail[];
}
