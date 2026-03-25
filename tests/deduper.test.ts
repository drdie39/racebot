import { describe, it, expect } from 'vitest';
import { AlertDeduper } from '@/src/core/alerts/deduper';

describe('deduper', () => {
  it('suppresses duplicates until clear', () => {
    const d = new AlertDeduper();
    expect(d.shouldEmit('k', true)).toBe(true);
    expect(d.shouldEmit('k', true)).toBe(false);
    expect(d.shouldEmit('k', false)).toBe(false);
    expect(d.shouldEmit('k', true)).toBe(true);
  });
});
