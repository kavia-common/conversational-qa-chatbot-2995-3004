export interface ThemeConfig {
  name: string;
  primary: string;
  secondary: string;
  error: string;
  background: string;
  surface: string;
  text: string;
  gradient: string;
}

export interface AppEnvironment {
  production: boolean;
  apiBaseUrl: string;
  theme: ThemeConfig;
}

// PUBLIC_INTERFACE
export const environment: AppEnvironment = {
  production: false,
  // NOTE: This should be set through environment variable in deployment, e.g. using Angular file replacements or runtime injection.
  // For local development you may change it to the dev backend host/port.
  apiBaseUrl: ((typeof globalThis !== 'undefined' && (globalThis as any).window && (globalThis as any).window.__QA_API_BASE_URL__) || 'http://localhost:3001'),
  theme: {
    name: 'Ocean Professional',
    primary: '#2563EB',
    secondary: '#F59E0B',
    error: '#EF4444',
    background: '#f9fafb',
    surface: '#ffffff',
    text: '#111827',
    gradient: 'linear-gradient(135deg, rgba(59,130,246,0.10), rgba(249,250,251,1))'
  }
};
