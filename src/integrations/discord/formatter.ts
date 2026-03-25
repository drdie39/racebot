import type { AlertEvent, UserConfig } from '@/src/types';

export function formatDiscordMessage(alert: AlertEvent, cfg: UserConfig): string {
  const tag = cfg.discord.roleId ? `<@&${cfg.discord.roleId}> ` : '';
  return `${tag}${alert.message}\n` +
    `Competitor: ${alert.competitor.driverName} (#${alert.competitor.carNumber}) | Class: ${alert.competitor.carClass} | ` +
    `P${alert.competitor.position} vs us P${alert.myCar.position} | Session: ${alert.sessionName} | Confidence: ${alert.confidence} | ${alert.timestamp}`;
}
