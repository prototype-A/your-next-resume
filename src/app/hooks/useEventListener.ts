import { useEffect } from "react";

/**
 * Executes functionality when `event` is emitted.
 * 
 * @param event - The event to listen for.
 * @param callback - The function to execute when the event is emitted.
 * @param dependencies - Cleans up and re-adds the event listener if any 
 * objects/values passed in this array changes.
 * @param options - The event listener options to set for `addEventListener`.
 */
export default function useEventListener(
  event: keyof WindowEventMap,
  callback: () => any,
  dependencies: any[] = [],
  options?: boolean | AddEventListenerOptions
): void {
  useEffect((): (() => void) => {
    addEventListener(event, callback, options);

    // Cleanup
    return () => removeEventListener(event, callback);
  }, dependencies);
}