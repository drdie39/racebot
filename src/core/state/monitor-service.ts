import { EventEmitter } from 'node:events';
import type { AlertEvent, CarEntry, UserConfig } from '@/src/types';
import type { ITelemetryAdapter } from '@/src/integrations/itelemetry/types';
import { findMyCar } from '@/src/core/classification/find-my-car';
import { sameClassAhead } from '@/src/core/classification/same-class-ahead';
import { detectMeatball } from '@/src/core/alerts/meatball';
import { AlertDeduper } from '@/src/core/alerts/deduper';
import { DiscordNotifier } from '@/src/integrations/discord/client';
import { logger } from './logger';

export interface RuntimeState {
  running: boolean;
  lastError?: string;
  sessionName?: string;
  sessionType?: string;
  myCar?: CarEntry;
  sameClassAhead: CarEntry[];
  watchTargets: CarEntry[];
  alerts: AlertEvent[];
  integrationHealth: string;
  message?: string;
}

export class MonitorService extends EventEmitter {
  private timer?: NodeJS.Timeout;
  private deduper = new AlertDeduper();
  private notifier: DiscordNotifier;
  private state: RuntimeState = {
    running: false,
    sameClassAhead: [],
    watchTargets: [],
    alerts: [],
    integrationHealth: 'unknown'
  };

  constructor(private adapter: ITelemetryAdapter, private config: UserConfig) {
    super();
    this.notifier = new DiscordNotifier(config);
  }

  getState() { return this.state; }

  updateConfig(config: UserConfig) {
    this.config = config;
    this.notifier = new DiscordNotifier(config);
  }

  async start() {
    if (this.state.running) return;
    await this.adapter.connect(this.config.sessionUrlOrId);
    this.state.running = true;
    this.poll();
  }

  async stop() {
    this.state.running = false;
    if (this.timer) clearTimeout(this.timer);
    await this.adapter.disconnect();
    this.emit('state', this.state);
  }

  private scheduleNext() {
    this.timer = setTimeout(() => this.poll(), this.config.pollingIntervalMs);
  }

  private async poll() {
    if (!this.state.running) return;
    try {
      const snapshot = await this.adapter.fetchSnapshot();
      const myCar = findMyCar(snapshot.cars, this.config);
      this.state.sessionName = snapshot.sessionName;
      this.state.sessionType = snapshot.sessionType;
      this.state.integrationHealth = this.adapter.health().details;

      if (!myCar) {
        this.state.message = 'Could not identify your car.';
        this.emit('state', this.state);
        this.scheduleNext();
        return;
      }

      this.state.myCar = myCar;
      const targets = sameClassAhead(snapshot.cars, myCar, snapshot.sessionType);
      this.state.sameClassAhead = targets;
      this.state.watchTargets = targets;
      this.state.message = snapshot.sessionType === 'race' ? undefined : 'Session is not race; ahead-of-me logic is degraded.';

      for (const car of targets) {
        const status = detectMeatball(car, snapshot);
        const key = `${snapshot.sessionId}:${car.id}:meatball`;
        if (this.deduper.shouldEmit(key, status.active)) {
          const alert: AlertEvent = {
            key,
            timestamp: new Date().toISOString(),
            competitor: car,
            myCar,
            sessionName: snapshot.sessionName,
            confidence: status.confidence,
            message: `Car #${car.carNumber} ahead in ${car.carClass} has a meatball flag.`
          };
          this.state.alerts = [alert, ...this.state.alerts].slice(0, 100);
          logger.warn({ alert }, 'Meatball alert');
          await this.notifier.notify(alert);
        }
      }

      this.state.lastError = undefined;
      this.emit('state', this.state);
    } catch (error) {
      this.state.lastError = error instanceof Error ? error.message : String(error);
      this.emit('state', this.state);
      logger.error({ err: error }, 'poll failed');
    } finally {
      this.scheduleNext();
    }
  }
}
