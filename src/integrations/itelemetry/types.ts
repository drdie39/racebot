import type { SessionSnapshot } from '@/src/types';

export interface ITelemetryAdapter {
  readonly name: string;
  connect(sessionUrlOrId: string): Promise<void>;
  disconnect(): Promise<void>;
  fetchSnapshot(): Promise<SessionSnapshot>;
  health(): { ok: boolean; details: string };
}
