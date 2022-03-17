export type Nullable<T> = T | null;

export type Only<T, U> = { [P in keyof T]: T[P] } & Omit<
  { [P in keyof U]?: never },
  keyof T
>;

export type Either<T, U> = Only<T, U> | Only<U, T>;

export declare const ObjectTyped: {
  keys<T extends {}>(object: T): (keyof T)[];
};
