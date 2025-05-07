import { useEffect, useState } from "react";
import { getItemAsJson, removeItem, setItemAsJson } from "../utils/LocalStorageUtils";

type UseLocalStorageStateReturns<T> = [
  state: T,
  setState: React.Dispatch<React.SetStateAction<T>>,
  clearState: () => void
];

export default function useLocalStorageState<T>(key: string, initialState: T): UseLocalStorageStateReturns<T> {

  const [ state, setState ] = useState<T>(initialState);

  /**
   * Updates the current state with the specified value or 
   * updater function.
   * 
   * @param newState The updated value or an updater function 
   * to set the state to.
   */
  function updateState(newState: React.SetStateAction<T>): void {
    if (newState instanceof Function) {
      // Updater function passed
      setState((prevState: T): T => {
        const NEW_VALUE = (newState as (prevState: T) => T)(prevState);
        setItemAsJson(key, NEW_VALUE);
        return NEW_VALUE;
      });
    } else {
      // Updated value passed
      setItemAsJson(key, newState);
      setState(newState);
    }
  }

  /**
   * Sets the state currently stored in localStorage 
   * back to `initialState`.
   */
  function clearState(): void {
    updateState(initialState);
    removeItem(key);
  }

  // Load saved state from localStorage on page load
  useEffect((): (() => void) => {
    let loadedFromLocalStorage = false;
    if (!loadedFromLocalStorage) {
      updateState(getItemAsJson(key) ?? initialState);
    }
    return () => { loadedFromLocalStorage = true; }
  }, []);

  return [ state, updateState, clearState ];
}