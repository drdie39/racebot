import type { CarEntry } from '@/src/types';

export interface PitStopThresholdResult {
  active: boolean;
  classAverageSeconds: number;
  currentSeconds: number;
  thresholdSeconds: number;
  reason?: string;
}

function extractClassSamples(cars: CarEntry[], targetClass: string): number[] {
  return cars
    .filter((car) => car.carClass === targetClass)
    .flatMap((car) => car.completedPitStopsSeconds ?? [])
    .filter((seconds) => Number.isFinite(seconds) && seconds > 0);
}

export function detectLongPitStop(
  car: CarEntry,
  cars: CarEntry[],
  thresholdPercent: number,
  minSamplesPerClass: number
): PitStopThresholdResult {
  const current = car.currentPitStopSeconds ?? 0;
  if (!car.inPit || current <= 0) {
    return { active: false, classAverageSeconds: 0, currentSeconds: 0, thresholdSeconds: 0, reason: 'not-in-pit' };
  }

  const samples = extractClassSamples(cars, car.carClass);
  if (samples.length < minSamplesPerClass) {
    return {
      active: false,
      classAverageSeconds: 0,
      currentSeconds: current,
      thresholdSeconds: 0,
      reason: 'insufficient-class-samples'
    };
  }

  const average = samples.reduce((acc, s) => acc + s, 0) / samples.length;
  const threshold = average * (1 + thresholdPercent / 100);

  return {
    active: current >= threshold,
    classAverageSeconds: average,
    currentSeconds: current,
    thresholdSeconds: threshold
  };
}
