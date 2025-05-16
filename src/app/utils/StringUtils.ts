/**
 * Prepends a string to the specified text if a condition is satisfied
 * (if it is not an empty string by default).
 * 
 * @param prefix - The prefix to prepend to the text.
 * @param text - The text to prefix if it is not empty.
 * @param condition - A boolean that determines whether to prefix the
 * text or not. The default condition is if `text` is an empty string.
 * @returns The `text` prepended with `prefix` if it is not empty.
 */
export function optionalPrefix(prefix: string, text: string, condition: boolean = text !== ""): string {
  return condition
    ? prefix + text
    : text;
}

/**
 * Appends a string to the specified text if a condition is satisfied
 * (if it is not an empty string by default).
 * 
 * @param text - The text to suffix if it is not empty.
 * @param suffix - The suffix to append to the text.
 * @param condition - A boolean that determines whether to prefix the
 * text or not. The default condition is if `text` is an empty string.
 * @returns The `text` appended with `suffix` if it is not empty.
 */
export function optionalSuffix(text: string, suffix: string, condition: boolean = text !== ""): string {
  return condition
    ? text + suffix
    : text;
}