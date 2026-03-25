import { describe, it, expect } from 'vitest';
import { detectMeatball } from '@/src/core/alerts/meatball';

describe('meatball detection', () => {
  it('prefers explicit race control', () => {
    const result = detectMeatball(
      { id: 'c', driverName: 'X', carNumber: '27', carClass: 'GT3', position: 1, flags: [] },
      { sessionId: 's', sessionName: 'r', sessionType: 'race', timestamp: '', cars: [], raceControlMessages: ['Car #27 shown black/orange'] }
    );
    expect(result).toEqual({ active: true, confidence: 'explicit' });
  });
});
