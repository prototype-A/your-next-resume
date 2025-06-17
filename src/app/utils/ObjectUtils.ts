/**
 * Indexes `obj` (deeply) and returns the value at `obj[key]`,
 * if found.
 * 
 * @param key - The (nested) key (e.g. "key", "key1.key2.key3")
 * to index `obj` with.
 * @returns The value of `obj[key]`, if it exists, otherwise
 * `undefined`.
 */
export function getNestedValue(obj: any, key: string): any {
  const KEYS: string[] = key.split(".") ?? [];
  let value: any = obj;
  for (let i: number = 0; i < KEYS.length; i++) {
    const NESTED_VALUE: any = value[KEYS[i]];
    if (value && NESTED_VALUE) {
      value = NESTED_VALUE;
    } else {
      return undefined;
    }
  }
  return value;
}

/**
 * Creates a new copy of `obj` and (deeply) replaces the value
 * at `obj[key]` with `newValue`, if found.
 * 
 * @param obj - The object to replace a (nested) value in.
 * @param key - The (nested) key (e.g. "key", "key1.key2.key3").
 * @param newValue - The value to set `obj[key]` to.
 * @return A deep clone of `obj` with the value at `obj[key]`
 * replaced with `newValue` if it exists, otherwise `undefined`.
 */
export function setNestedValue(obj: any, key: string, newValue: any): typeof obj | undefined {
  const KEYS: string[] = key.split(".");
  const NEW_OBJECT: typeof obj = structuredClone(obj);
  let object: any = NEW_OBJECT;
  for (let i: number = 0; i < KEYS.length; i++) {
    const NESTED_OBJ: any = object[KEYS[i]];
    if (object && NESTED_OBJ) {
      // Set new value
      if (i === KEYS.length - 1) {
        object[KEYS[i]] = newValue;
        return NEW_OBJECT;
      }
      // Move a layer deeper
      object = NESTED_OBJ;
    } else {
      return undefined;
    }
  }
}