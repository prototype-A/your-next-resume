/**
 * Retrieves the value under the specified `key` from localStorage.
 * 
 * @typeParam T - The type of the value to retrieve.
 * @param key - The string that the value is stored under.
 * @returns The value to `key` as a string if present, otherwise `null`.
 */
export function getItemAsJson<T>(key: string): T | null {
  return JSON.parse(localStorage.getItem(key) as string) as T ?? null;
}

/**
 * Removes the value under the specified `key` from localStorage.
 * 
 * @param key - The string that the value is stored under.
 */
export function removeItem(key: string): void {
  localStorage.removeItem(key);
}

/**
 * Stores the value under the specified `key` into localStorage.
 * 
 * @typeParam T - The type of the value to store.
 * @param key - The string that the value will be stored under.
 * @param value - The value to store.
 * 
 * @throws "QuotaExceededError" DOMException
 * If the new value could not be set (e.g. due to disabled 
 * site storage or exceeded quota).
 */
export function setItemAsJson<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}
