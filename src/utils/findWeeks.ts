export const findWeeks = (sd: Date, ed: Date): number => {
  const duration = ed.getTime() - sd.getTime();
  const durationDays = duration / (1000 * 3600 * 24);
  return Math.round(durationDays/7);
};
