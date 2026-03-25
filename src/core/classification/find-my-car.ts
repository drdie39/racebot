import type { CarEntry, UserConfig } from '@/src/types';

export function findMyCar(cars: CarEntry[], config: UserConfig): CarEntry | undefined {
  if (config.myCarNumber) {
    const byNumber = cars.find((c) => c.carNumber === config.myCarNumber);
    if (byNumber) return byNumber;
  }
  if (config.myDriverName) {
    const normalized = config.myDriverName.toLowerCase();
    const aliases = config.driverAliasMap[config.myDriverName] ?? [];
    return cars.find((c) => {
      const name = c.driverName.toLowerCase();
      return name === normalized || aliases.map((a) => a.toLowerCase()).includes(name);
    });
  }
  return undefined;
}
