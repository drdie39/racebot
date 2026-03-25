import { MonitorService } from './monitor-service';
import { loadConfig, saveConfig } from './config-store';
import { MockITelemetryAdapter } from '@/src/integrations/itelemetry/mock-adapter';

const globalForMonitor = globalThis as unknown as { monitor?: MonitorService };

export function getMonitor(): MonitorService {
  if (!globalForMonitor.monitor) {
    const cfg = loadConfig();
    globalForMonitor.monitor = new MonitorService(new MockITelemetryAdapter(), cfg);
  }
  return globalForMonitor.monitor;
}

export function getConfig() {
  return loadConfig();
}

export function setConfig(raw: ReturnType<typeof loadConfig>) {
  const cfg = saveConfig(raw);
  getMonitor().updateConfig(cfg);
  return cfg;
}
