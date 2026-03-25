import type { CarEntry, SessionType } from '@/src/types';

export function sameClassAhead(cars: CarEntry[], myCar: CarEntry, sessionType: SessionType): CarEntry[] {
  if (sessionType !== 'race') return [];
  return cars
    .filter((car) => car.id !== myCar.id)
    .filter((car) => car.carClass === myCar.carClass)
    .filter((car) => car.position < myCar.position)
    .sort((a, b) => a.position - b.position);
}
