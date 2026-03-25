import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import type { UserConfig } from '@/src/types';

const filePath = path.join(process.cwd(), 'config', 'user-config.json');

const ConfigSchema = z.object({
  myDriverName: z.string().optional(),
  myCarNumber: z.string().optional(),
  sessionUrlOrId: z.string().default('demo-session'),
  pollingIntervalMs: z.number().min(1000).default(5000),
  duplicateCooldownMs: z.number().min(1000).default(30000),
  discord: z.object({
    mode: z.enum(['none', 'webhook', 'bot']).default('none'),
    roleId: z.string().optional(),
    webhookUrl: z.string().optional(),
    botToken: z.string().optional(),
    channelId: z.string().optional()
  }),
  driverAliasMap: z.record(z.string(), z.array(z.string())).default({})
});

export function loadConfig(): UserConfig {
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    const defaultConfig = ConfigSchema.parse({});
    fs.writeFileSync(filePath, JSON.stringify(defaultConfig, null, 2));
    return defaultConfig;
  }
  return ConfigSchema.parse(JSON.parse(fs.readFileSync(filePath, 'utf-8')));
}

export function saveConfig(config: UserConfig): UserConfig {
  const parsed = ConfigSchema.parse(config);
  fs.writeFileSync(filePath, JSON.stringify(parsed, null, 2));
  return parsed;
}
