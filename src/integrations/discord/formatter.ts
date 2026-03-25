import type { AlertEvent, UserConfig } from '@/src/types';

export function formatDiscordMessage(alert: AlertEvent, cfg: UserConfig): string {
  const tag = cfg.discord.roleId ? `<@&${cfg.discord.roleId}> ` : '';
  return `${tag}ALERT: Car #${alert.competitor.carNumber} (${alert.competitor.driverName}) in ${alert.competitor.carClass} ahead of us has received a meatball flag.\n` +
    `Position ${alert.competitor.position} vs us P${alert.myCar.position} | Session: ${alert.sessionName} | Confidence: ${alert.confidence} | ${alert.timestamp}`;
}
