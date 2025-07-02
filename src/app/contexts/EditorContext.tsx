import { createContext, useState } from "react";
import type { HasChildrenProp, ResumeItem, SetStateFn, TextFormatting } from "../components/Types";
import { setNestedValue } from "../utils/ObjectUtils";

type ItemUpdateFn = (updatedItem: ResumeItem) => void;
type EditingField = string | null
type EditingItem = ResumeItem | null;
export type EditorState = {
  editingField: EditingField,
  editingItem: EditingItem,
  editItem: (item: EditingItem, itemUpdater?: ItemUpdateFn) => void,
  hideEditor: (hide: boolean) => void,
  setEditingField: SetStateFn<EditingField>,
  updateField: (formatting: TextFormatting) => void,
  updateItem: (updatedItem: React.SetStateAction<ResumeItem>) => void,
  visible: boolean
};
const EmptyFn: (() => void) = (): void => {};

export const EditorContext: React.Context<EditorState> = createContext<EditorState>({
  editingField: null,
  editingItem: null,
  editItem: EmptyFn,
  hideEditor: EmptyFn,
  setEditingField: EmptyFn,
  updateField: EmptyFn,
  updateItem: EmptyFn,
  visible: false
});

export function EditorContextProvider({
  children
}: HasChildrenProp): React.ReactNode {

  const [ visible, setVisible ] = useState<boolean>(false);
  const [ editingItem, setEditingItem ] = useState<EditingItem>(null);
  const [ editingItemUpdateFn, setEditingItemUpdateFn ] = useState<ItemUpdateFn>(() => {});
  const [ editingField, setEditingField ] = useState<EditingField>(null);

  /**
   * Updates the item that is currently being edited with the
   * specified `itemUpdate`.
   * 
   * @param itemUpdate - The updated item or a callback function
   * that updates the previous item state.
   */
  function updateItem(itemUpdate: React.SetStateAction<ResumeItem>): void {
    const UPDATED_ITEM: ResumeItem = itemUpdate instanceof Function
      ? itemUpdate(editingItem as ResumeItem)
      : itemUpdate;
    editingItemUpdateFn(UPDATED_ITEM);
    setEditingItem(UPDATED_ITEM);
  }

  return (
    <EditorContext.Provider
      value={{
        editingField: editingField,
        editingItem: editingItem,
        editItem: (item: EditingItem, itemUpdater: ItemUpdateFn = EmptyFn): void => {
          setEditingItemUpdateFn((): ItemUpdateFn => (updatedItem: ResumeItem) => itemUpdater(updatedItem));
          setEditingItem(item);
          setEditingField(null);
          setVisible(item ? true : false);
        },
        hideEditor: (hide: boolean): void => setVisible(!hide),
        setEditingField: setEditingField,
        updateField: (formatting: TextFormatting): void => {
          if (editingField) {
            updateItem(setNestedValue(editingItem, editingField, formatting) as ResumeItem);
          }
        },
        updateItem: updateItem,
        visible: visible
      }}
    >
      { children }
    </EditorContext.Provider>
  );
}