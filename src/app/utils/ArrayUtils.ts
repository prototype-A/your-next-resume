type Key = string | number | symbol;
type IndexedObj = {
  id: number
};
type AnyObj = {
  [key: Key]: any
};

/**
 * Return a copy of `arr` with each element converted to an object 
 * assigned as `key: element` and indexed by their initial order.
 * 
 * @param arr - The array of elements to map as objects.
 * @param key - The string/number/symbol to use to access the element 
 * in the object.
 * @returns A new array with each element in `arr` mapped as an object.
 */
export function mapElementsAsObjects<T>(arr: T[], key: Key): (IndexedObj & AnyObj)[] {
  return arr.map((elem: T, idx: number): IndexedObj & AnyObj => ({
    id: idx,
    [key]: elem
  }));
}

/**
 * (Re-)assigns the `id` property of all elements in `arr` in ascending order.
 * The `id` property will be created if it does not currently exist.
 * 
 * @typeParam T - The type of the elements stored in `arr`.
 * @param arr - The array of elements to (re-)assign the IDs of.
 * @returns The array with all of its elements' IDs in ascending order.
 */
export function reassignIds<T>(arr: T[]): T[] {
  return arr.map((elem: T, idx: number): T => ({
    ...elem,
    id: idx
  }));
}

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

/**
 * Return a shallow copy of `arr` without the element `elemToRemove` in it.
 * 
 * @typeParam T - The type of the elements stored in `arr`.
 * @param arr - The array to remove an element from.
 * @param elemToRemove - The element to remove.
 * @returns `arr` with `elemToRemove` filtered out.
 */
export function removeElement<T>(arr: T[], elemToRemove: T): T[] {
  // Return a copy of arr without elemToRemove in it
  return arr.filter((elem: T): boolean => elem !== elemToRemove);
}
