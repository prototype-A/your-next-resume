import { createContext, useEffect, useState } from "react";
import ContextMenu, { ContextMenuItem } from "../components/ContextMenu";
import type { Coordinates, HasChildrenProp } from "../components/Types";
import { DEFAULT_COORDINATES } from "../components/Types";

type DisplayContextMenuFn = (position: Coordinates, items: ContextMenuItem[]) => void;
export const ContextMenuContext = createContext<DisplayContextMenuFn>((_: Coordinates, __: ContextMenuItem[]): void => {});

export function ContextMenuContextProvider({
  children
}: HasChildrenProp): React.ReactNode {

  const [ position, setPosition ] = useState<Coordinates>(DEFAULT_COORDINATES);
  const [ visible, setVisible ] = useState<boolean>(false);
  const [ items, setItems ] = useState<ContextMenuItem[]>([]);

  function showContextMenu(position: Coordinates, items: ContextMenuItem[]): void {
    setItems(items);
    setPosition(position);
    setVisible(true);
  }

  // Close context menu
  useEffect((): (() => void) => {
    const closeContextMenu = (): void => {
      setVisible(false);
    }
    const escapeContextMenu = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        setVisible(false);
      }
    }
    // Hide context menu when clicking outside
    addEventListener("click", closeContextMenu, true);
    // Hide context menu when "Esc" key is pressed
    addEventListener("keyup", escapeContextMenu);

    // Cleanup
    return (): void => {
      removeEventListener("click", closeContextMenu, true);
      removeEventListener("keyup", escapeContextMenu);
    }
  }, []);

  return (
    <ContextMenuContext.Provider value={ showContextMenu }>
      { children }
      <ContextMenu
        items={ items }
        position={ position }
        visible={ visible }
      />
    </ContextMenuContext.Provider>
  );
}