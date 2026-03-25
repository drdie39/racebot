import { describe, it, expect } from 'vitest';
import { sameClassAhead } from '@/src/core/classification/same-class-ahead';

const cars = [
  { id: '1', driverName: 'A', carNumber: '1', carClass: 'GT3', position: 2, flags: [] },
  { id: '2', driverName: 'B', carNumber: '2', carClass: 'GT3', position: 5, flags: [] },
  { id: '3', driverName: 'C', carNumber: '3', carClass: 'GTP', position: 1, flags: [] }
];

describe('same class ahead', () => {
  it('filters same class and ahead only', () => {
    const ahead = sameClassAhead(cars as any, cars[1] as any, 'race');
    expect(ahead).toHaveLength(1);
    expect(ahead[0].carNumber).toBe('1');
  });

  it('degrades in non-race sessions', () => {
    expect(sameClassAhead(cars as any, cars[1] as any, 'practice')).toEqual([]);
  });
});
