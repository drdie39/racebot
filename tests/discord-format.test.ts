import { describe, it, expect } from 'vitest';
import { formatDiscordMessage } from '@/src/integrations/discord/formatter';

describe('discord formatting', () => {
  it('formats team tag and key fields', () => {
    const msg = formatDiscordMessage({
      key: 'k',
      timestamp: '2026-01-01T00:00:00Z',
      confidence: 'explicit',
      sessionName: 'Race',
      myCar: { id: 'm', driverName: 'Me', carNumber: '88', carClass: 'GT3', position: 9, flags: [] },
      competitor: { id: 'c', driverName: 'Them', carNumber: '27', carClass: 'GT3', position: 7, flags: [] },
      message: ''
    }, {
      sessionUrlOrId: 'x', pollingIntervalMs: 1000, duplicateCooldownMs: 1000, driverAliasMap: {},
      discord: { mode: 'webhook', roleId: '42' }
    } as any);

    expect(msg).toContain('<@&42>');
    expect(msg).toContain('Car #27');
    expect(msg).toContain('Confidence: explicit');
  });
});
