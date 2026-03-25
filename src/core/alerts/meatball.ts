import type { CarEntry, Confidence, SessionSnapshot } from '@/src/types';

function explicitMessageFor(car: CarEntry, snapshot: SessionSnapshot): boolean {
  return snapshot.raceControlMessages.some((msg) => {
    const m = msg.toLowerCase();
    return m.includes(car.carNumber.toLowerCase()) && (m.includes('black/orange') || m.includes('meatball'));
  });
}

export function detectMeatball(car: CarEntry, snapshot: SessionSnapshot): { active: boolean; confidence: Confidence } {
  if (explicitMessageFor(car, snapshot)) {
    return { active: true, confidence: 'explicit' };
  }
  const inferred = car.flags.includes('MEATBALL') || car.penaltyStatus === 'TECHNICAL';
  return { active: inferred, confidence: inferred ? 'inferred' : 'explicit' };
}
