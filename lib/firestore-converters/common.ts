export function checkType<T>(
  value: unknown,
  field: string,
  member_name: string,
  expectedType: string,
): T | null {
  if (value == undefined || value == null) {
    return null;
  }
  if (typeof value !== expectedType) {
    console.warn(
      `Expected ${expectedType}, got ${typeof value} for value ${value}. Field: ${field}. Member: ${member_name}`,
    );
    return null;
  }
  return value as T;
}
