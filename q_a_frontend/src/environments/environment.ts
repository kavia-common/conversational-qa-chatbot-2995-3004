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

/**
 * Compute a sensible default API base URL:
 * - If window.__QA_API_BASE_URL__ is provided, use it (deployment/runtime override).
 * - Else, if running in a browser with known host, assume backend is on same host at port 3001 over HTTPS.
 * - Else, fall back to http://localhost:3001 for local dev.
 */
function resolveApiBaseUrl(): string {
  const w: any = (typeof globalThis !== 'undefined' && (globalThis as any).window) ? (globalThis as any).window : undefined;
  if (w && typeof w.__QA_API_BASE_URL__ === 'string' && w.__QA_API_BASE_URL__) {
    return w.__QA_API_BASE_URL__;
  }
  if (w && w.location && typeof w.location.host === 'string' && w.location.host) {
    const host = w.location.hostname;
    // Prefer https to avoid mixed content from an https page
    const protocol = 'https';
    return `${protocol}://${host}:3001`;
  }
  return 'http://localhost:3001';
}

// PUBLIC_INTERFACE
export const environment: AppEnvironment = {
  production: false,
  // Dynamically resolved to avoid mixed content and wrong-host issues in hosted preview.
  apiBaseUrl: resolveApiBaseUrl(),
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
