import type { Coordinates } from "./Types";
import { Dropdown, DropdownItem, DropdownMenu } from "@heroui/react";

export type ContextMenuItem = {
  onPress: () => void,
  text: string
};
type ContextMenuProps = {
  items: ContextMenuItem[],
  position: Coordinates,
  visible: boolean
};

export default function ContextMenu({
  items,
  position,
  visible
}: ContextMenuProps): React.ReactNode {
  return (
    <Dropdown
      className="bg-black"
      isOpen={ visible }
      onContextMenu={(event: React.MouseEvent) => {
        // Do not display the browser's or any other context menu
        event.preventDefault();
        event.stopPropagation();
      }}
      style={{
        top: position.y,
        left: position.x
      }}
      tabIndex={ -1 }
    >
      <></>
      <DropdownMenu items={ items }>
        { (item: ContextMenuItem): React.JSX.Element =>
          <DropdownItem
            key={ item.text }
            onPress={ item.onPress }
            textValue={ item.text }
          >
            { item.text }
          </DropdownItem>
        }
      </DropdownMenu>
    </Dropdown>
  );
}