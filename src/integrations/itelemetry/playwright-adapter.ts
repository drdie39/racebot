import type { ITelemetryAdapter } from './types';
import type { SessionSnapshot } from '@/src/types';

export class PlaywrightITelemetryAdapter implements ITelemetryAdapter {
  readonly name = 'playwright-fallback';
  async connect(): Promise<void> {}
  async disconnect(): Promise<void> {}

  async fetchSnapshot(): Promise<SessionSnapshot> {
    throw new Error('Playwright fallback not configured in this environment.');
  }

  health() {
    return { ok: false, details: 'requires Playwright + user login profile' };
  }
}
