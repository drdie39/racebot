export type SessionType = 'race' | 'practice' | 'qualifying';
export type Confidence = 'explicit' | 'inferred';

export interface CarEntry {
  id: string;
  driverName: string;
  carNumber: string;
  carClass: string;
  position: number;
  flags: string[];
  penaltyStatus?: string;
  inPit?: boolean;
  currentPitStopSeconds?: number;
  completedPitStopsSeconds?: number[];
}

export interface SessionSnapshot {
  sessionId: string;
  sessionName: string;
  sessionType: SessionType;
  timestamp: string;
  cars: CarEntry[];
  raceControlMessages: string[];
}

export interface UserConfig {
  myDriverName?: string;
  myCarNumber?: string;
  sessionUrlOrId: string;
  pollingIntervalMs: number;
  duplicateCooldownMs: number;
  pitStopThresholdPercent: number;
  minPitSamplesPerClass: number;
  discord: {
    mode: 'none' | 'webhook' | 'bot';
    roleId?: string;
    webhookUrl?: string;
    botToken?: string;
    channelId?: string;
  };
  driverAliasMap: Record<string, string[]>;
}

export interface AlertEvent {
  key: string;
  timestamp: string;
  competitor: CarEntry;
  myCar: CarEntry;
  sessionName: string;
  confidence: Confidence;
  message: string;
}
