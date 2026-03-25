import type { ITelemetryAdapter } from './types';
import type { SessionSnapshot } from '@/src/types';

/**
 * Placeholder for safe read-only browser-observed endpoints.
 * Requires user-provided session cookies and explicit endpoint configuration.
 */
export class LiveHttpITelemetryAdapter implements ITelemetryAdapter {
  readonly name = 'live-http';
  private endpoint = '';

  async connect(sessionUrlOrId: string): Promise<void> {
    this.endpoint = sessionUrlOrId;
  }
  async disconnect(): Promise<void> {}

  async fetchSnapshot(): Promise<SessionSnapshot> {
    const res = await fetch(this.endpoint, { headers: { accept: 'application/json' } });
    if (!res.ok) throw new Error(`Live endpoint returned ${res.status}`);
    return (await res.json()) as SessionSnapshot;
  }

  health() {
    return {
      ok: Boolean(this.endpoint),
      details: this.endpoint ? 'configured live endpoint' : 'missing endpoint'
    };
  }
}
