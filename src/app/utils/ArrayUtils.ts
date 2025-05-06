/**
 * Return a shallow copy of `arr` without the element at `index` in it.
 * 
 * @typeParam T - The type of the elements stored in `arr`.
 * @param arr - The array to remove an element from.
 * @param index - The index of the element to remove.
 * @returns `arr` with the element at `index` filtered out.
 */
export function removeAtIndex<T>(arr: T[], index: number): T[] {
  return arr.filter((_: T, idx: number): boolean => idx !== index);
}
