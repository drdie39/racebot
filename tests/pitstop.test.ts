import { describe, it, expect } from 'vitest';
import { detectLongPitStop } from '@/src/core/alerts/pitstop';

describe('long pit stop detection', () => {
  it('fires when current stop exceeds class average threshold', () => {
    const cars = [
      { id: 'a', driverName: 'A', carNumber: '10', carClass: 'GT3', position: 1, flags: [], completedPitStopsSeconds: [40, 42] },
      { id: 'b', driverName: 'B', carNumber: '11', carClass: 'GT3', position: 2, flags: [], completedPitStopsSeconds: [39, 41] },
      { id: 'c', driverName: 'C', carNumber: '12', carClass: 'GT3', position: 3, flags: [], inPit: true, currentPitStopSeconds: 50, completedPitStopsSeconds: [40] }
    ];
    const result = detectLongPitStop(cars[2] as any, cars as any, 15, 3);
    expect(result.active).toBe(true);
  });
});
