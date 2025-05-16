import { Reorder, useDragControls } from "framer-motion";
import { Button, Input } from "@heroui/react";
import { useRef, useState } from "react";
import type { Ref } from "./Types";
import { reassignIds, removeElement } from "../utils/ArrayUtils";
import "../styles/editors.css";
import "../styles/page.css";


type ListItem = {
  id: number,
  label?: string,
  value: string
};

type ItemProps = {
  canDelete: boolean,
  constraintRef?: Ref<HTMLElement>,
  deleteItem?: () => void,
  item: ListItem,
  updateItem?: (newValue: string) => void
};

const ReorderableItem = ({
  canDelete,
  constraintRef,
  deleteItem,
  item,
  updateItem
}: ItemProps): React.ReactNode => {

  const dragControls = useDragControls();

  return (
    <Reorder.Item
      className="flex-row relative w-full h-full"
      dragConstraints={ constraintRef }
      dragControls={ dragControls }
      dragElastic={ 0 }
      dragListener={ false }
      dragTransition={{
        bounceStiffness: 400,
        bounceDamping: 50
      }}
      id={ item.id.toString() }
      key={ item.id }
      value={ item }
    >
      <div
        className="content-center cursor-move w-6"
        onPointerDown={(event: React.PointerEvent<HTMLDivElement>): void =>
          dragControls.start(event)
        }
        style={{ touchAction: "none" }}
      >
        { "=" }
      </div>
      <Input
        className="w-full"
        label={ item.label }
        onValueChange={ updateItem }
        value={ item.value }
        radius="sm">
      </Input>
      { canDelete &&
        <Button
          className="bg-gray-400"
          onPress={ deleteItem }
          radius="sm"
        >
          { "-" }
        </Button>
      }
    </Reorder.Item>
  );
};


type ListProps = {
  items?: string[],
  labels?: string[],
  resizable?: boolean,
  updateList: (updatedList: string[]) => void
};

export default function ReorderableList({
  items,
  labels,
  resizable = true,
  updateList
}: ListProps): React.ReactNode {

  const [listItems, setListItems] = useState<ListItem[]>(labels && labels.length > (items ? items.length : 0)
    ? labels.map((label: string, index: number): ListItem => ({ id: index, label: label, value: "" }))
    : items
    ? items.map((item: string, index: number): ListItem => ({ id: index, value: item }))
    : []
  );
  const dragBoundsRef: Ref<HTMLElement> = useRef<HTMLElement>(null);

  /**
   * Converts the specified array of `ListItem` into a string
   * array of just its values.
   * 
   * @param list - The array of `ListItem`s to convert.
   * @returns A string array containing the values of each
   * element from `list`.
   */
  function listItemsToStringArray(list: ListItem[]): string[] {
    return list.map((item: ListItem): string => item.value)
  }

  return (<>
    <Reorder.Group
      axis="y"
      className="space-y-2 text"
      layoutScroll
      onReorder={(newListOrder: ListItem[]): void => {
        // Update list order
        setListItems(newListOrder);
        // Display order change on element
        updateList(listItemsToStringArray(newListOrder));
      }}
      ref={ dragBoundsRef }
      values={ listItems }
    >
      { listItems.map((listItem: ListItem, itemIndex: number): React.ReactNode => 
        <ReorderableItem
          canDelete={ resizable }
          constraintRef={ dragBoundsRef }
          deleteItem={(): void => {
            // Delete item
            const UPDATED_LIST: ListItem[] = reassignIds(removeElement(listItems, listItem));
            // Update list
            setListItems(UPDATED_LIST);
            // Update element
            updateList(listItemsToStringArray(UPDATED_LIST));
          }}
          item={ listItem }
          key={ listItem.id }
          updateItem={(newValue: string): void => {
            // Update item
            const UPDATED_LIST: ListItem[] = listItems.map((item: ListItem, index: number): ListItem => {
              if (index !== itemIndex) {
                return item;
              }
              return {
                ...item,
                value: newValue
              };
            });
            // Update list
            setListItems(UPDATED_LIST);
            // Update element
            updateList(listItemsToStringArray(UPDATED_LIST));
          }}
        />
      )}
    </Reorder.Group>
    { resizable &&
      <Button
        className="button"
        onPress={(): void => {
          // Add new item
          setListItems([
            ...listItems,
            {
              id: listItems.length,
              value: ""
            }
          ]);
        }}
        size="sm"
      >
        { "+" }
      </Button>
    }
  </>);
}