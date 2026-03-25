import type { AlertEvent, UserConfig } from '@/src/types';
import { formatDiscordMessage } from './formatter';

export class DiscordNotifier {
  constructor(private cfg: UserConfig) {}

  async notify(alert: AlertEvent): Promise<void> {
    if (this.cfg.discord.mode === 'none') return;
    const content = formatDiscordMessage(alert, this.cfg);
    if (this.cfg.discord.mode === 'webhook' && this.cfg.discord.webhookUrl) {
      await fetch(this.cfg.discord.webhookUrl, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ content })
      });
      return;
    }
    if (this.cfg.discord.mode === 'bot' && this.cfg.discord.botToken && this.cfg.discord.channelId) {
      await fetch(`https://discord.com/api/v10/channels/${this.cfg.discord.channelId}/messages`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bot ${this.cfg.discord.botToken}`
        },
        body: JSON.stringify({ content })
      });
    }
  }
}
