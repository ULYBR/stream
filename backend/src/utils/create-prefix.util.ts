export enum KeyPrefix {
  User = "USER",
  Stream = "STREAM",
  Category = "CATEGORY",
}

export const createPrefix = <T extends string | number>(
  prefix: KeyPrefix,
  key: T,
): string => `${prefix}#${key}`;
