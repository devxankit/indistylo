/**
 * Converts "HH:MM" time string to minutes from midnight
 */
export const timeToMinutes = (time: string): number => {
  const parts = time.split(":").map(Number);
  const hours = parts[0] ?? 0;
  const minutes = parts[1] ?? 0;
  return hours * 60 + minutes;
};

/**
 * Checks if two time ranges overlap
 */
export const isOverlapping = (
  start1: number,
  end1: number,
  start2: number,
  end2: number
): boolean => {
  return start1 < end2 && start2 < end1;
};
