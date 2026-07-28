// Shared type definitions
export * from './vendor';

export type UUID = string & { readonly __brand: 'UUID' };

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type Primitive = string | number | boolean | Date;