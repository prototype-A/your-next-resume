/**
 * Returns the input value if it is within the range specified 
 * by `min` and `max`, otherwise `min` if it is smaller and `max` 
 * if it is greater.
 * 
 * @param num - The value to clamp between the specified range.
 * @param min - The minimum value to return.
 * @param max - The maximum value to return.
 * @param offset - The value to offset `num` and `max` by.
 * @returns The value, clamped between `min` and `max`, offset by `offset`.
 */
export function clamp(num: number, min: number, max: number, offset: number = 0): number {
  return num + offset > max
    ? max - offset
    : num + offset < min + offset
    ? min
    : num;
}