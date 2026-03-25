import type { ITelemetryAdapter } from './types';
import type { SessionSnapshot } from '@/src/types';
import seed from '@/data/mock-session.json';

export class MockITelemetryAdapter implements ITelemetryAdapter {
  readonly name = 'mock';
  private tick = 0;
  async connect(): Promise<void> {}
  async disconnect(): Promise<void> {}

  async fetchSnapshot(): Promise<SessionSnapshot> {
    this.tick += 1;
    const snapshot = structuredClone(seed) as SessionSnapshot;
    snapshot.timestamp = new Date().toISOString();
    const toggled = this.tick % 4 === 0;
    const target = snapshot.cars.find((car) => car.carNumber === '27');
    if (target) {
      target.flags = toggled ? ['MEATBALL'] : [];
      target.penaltyStatus = toggled ? 'TECHNICAL' : undefined;
      if (toggled) {
        snapshot.raceControlMessages.push(`Car #${target.carNumber} shown black/orange.`);
      }
    }
    return snapshot;
  }

  health() {
    return { ok: true, details: 'demo mode active' };
  }
}
