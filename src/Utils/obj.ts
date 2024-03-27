export const size = <T>(record: Record<string, T>): number =>
  Object.keys(record).length;

export const has = <T>(record: Record<string, T>, key: string): boolean =>
  record.hasOwnProperty(key);

export const get = <T>(record: Record<string, T>, key: string): T => ({
  ...record[key],
});
