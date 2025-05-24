import { createContext, useState } from "react";
import type { HasChildrenProp, ResumeItem } from "../components/Types";

type ItemUpdateFn = (updatedItem: ResumeItem) => void;
export type EditingItem = ResumeItem | null;
export type EditorState = {
  visible: boolean,
  editingItem: EditingItem,
  editItem: (item: EditingItem, itemUpdater?: ItemUpdateFn) => void,
  updateItem: (updatedItem: React.SetStateAction<ResumeItem>) => void,
  hideEditor: (hide: boolean) => void
};
const EmptyFn: (() => void) = (): void => {};

export const EditorContext = createContext<EditorState>({
  visible: false,
  editingItem: null,
  editItem: EmptyFn,
  updateItem: EmptyFn,
  hideEditor: EmptyFn
});

export function EditorContextProvider({
  children
}: HasChildrenProp): React.ReactNode {

  const [ visible, setVisible ] = useState<boolean>(false);
  const [ editingItem, setEditingItem ] = useState<EditingItem>(null);
  const [ editingItemUpdateFn, setEditingItemUpdateFn ] = useState<ItemUpdateFn>(() => {});

  return (
    <EditorContext.Provider
      value={{
        visible: visible,
        editingItem: editingItem,
        editItem: (item: EditingItem, itemUpdater: ItemUpdateFn = EmptyFn): void => {
          setEditingItemUpdateFn((): ItemUpdateFn => (updatedItem: ResumeItem) => itemUpdater(updatedItem));
          setEditingItem(item);
          setVisible(item ? true : false);
        },
        updateItem: (itemUpdate: React.SetStateAction<ResumeItem>): void => {
          const UPDATED_ITEM: ResumeItem = itemUpdate instanceof Function
            ? itemUpdate(editingItem as ResumeItem)
            : itemUpdate;
          editingItemUpdateFn(UPDATED_ITEM);
          setEditingItem(UPDATED_ITEM);
        },
        hideEditor: (hide: boolean): void => !hide && editingItem
          ? setVisible(true)
          : setVisible(false)
      }}
    >
      { children }
    </EditorContext.Provider>
  );
}