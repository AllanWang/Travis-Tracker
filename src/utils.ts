export function n<T, U>(value: T | null | undefined, convert: (value: T) => U | null): U | null {
  return value ? convert(value) : null
}
