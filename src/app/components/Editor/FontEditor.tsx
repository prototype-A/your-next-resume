import { Autocomplete, AutocompleteItem, AutocompleteSection, NumberInput } from "@heroui/react";
import { useContext } from "react";
import ButtonGroup from "./ButtonGroup";
import { FlexRowDiv, VSpacedDiv } from "../Containers";
import type { HAlign, TextFormatting } from "../Types";
import { DEFAULT_FONT_LIST, DEFAULT_FONT_SIZE } from "../Types";
import { EditorContext, type EditorState } from "@/app/contexts/EditorContext";
import { mapElementsAsObjects } from "@/app/utils/ArrayUtils";
import { getNestedValue, setNestedValue } from "@/app/utils/ObjectUtils";

export default function FontEditor(): React.ReactNode {

  const { editingItem, editingField, updateItem, updateField } = useContext<EditorState>(EditorContext);
  const BASE_FONTS: { [key: string]: string }[] = mapElementsAsObjects(
    DEFAULT_FONT_LIST,
    "name"
  );

  /**
   * React Aria dynamic collection render function for `Autocomplete`.
   * 
   * @param item - An object with a string mapped to the key "name".
   * @returns An `AutocompleteItem` JSX element .
   */
  function getAutocompleteItem(item: { [key: string]: string }): React.JSX.Element {
    return (
      <AutocompleteItem
        className="text-black"
        key={ item.name }
      >
        { item.name }
      </AutocompleteItem>
    );
  }

  /**
   * Returns the formatting of the text field currently being edited.
   * 
   * @returns The `TextFormatting` of the currently highlighted field.
   */
  function getCurrentTextFormatting(): TextFormatting | undefined {
    return getNestedValue(editingItem ?? {}, editingField ?? "") as TextFormatting ?? undefined;
  }

  /**
   * Returns whether the text in the currently highlighted field in 
   * the editor contains a certain style (e.g. bolded, italicized, etc.).
   * 
   * @param style - The string to check if the `Text`'s `styles` value
   * includes.
   * @returns True if the `Text`'s style includes the specified style.
   */
  function hasStyle(style: string): boolean {
    const FORMATTING: TextFormatting | undefined = getCurrentTextFormatting();
    return FORMATTING
      ? FORMATTING.style.includes(style)
      : false;
  }

  /**
   * Returns whether the text in the currently highlighted field in
   * the editor is horizontally aligned a certain way.
   * 
   * @param alignment - The string that represents the text alignment.
   * @returns True if the `Text`'s horizontal alignment matches `alignment`.
   */
  function isAligned(alignment: HAlign): boolean {
    const FORMATTING: TextFormatting | undefined = getCurrentTextFormatting();
    return FORMATTING
      ? FORMATTING.hAlign === alignment
      : false;
  }

  /**
   * Replaces `styleToReplace` with `newStyle` if it is applied in `styles.
   * If no `styleToReplace` is specified, all applied `styles` are removed
   * and `newStyle` is toggled on/off.
   * 
   * @param styles - The string of styles currently applied to the `Text`.
   * @param styleToReplace - The string representing the style to replace.
   * If an empty string, replaces all `styles` with `newStyle`.
   * @param newStyle - The string representing the style to set.
   * @returns The new `styles` to apply to the `Text`.
   */
  function replaceStyle(styles: string, styleToReplace: string, newStyle: string): string {
    // Replace all styles if none are specified
    if (styleToReplace === "") {
      return styles.includes(newStyle)
        ? ""
        : newStyle;
    } else if (!styles.includes(styleToReplace)) {
      // Toggle style if specified style to replace was not found
      return toggleStyle(styles, newStyle);
    }
    // Replace only specified style
    return styles.replace(styleToReplace, newStyle);
  }

  /**
   * Adds the specified `style` to `styles` if it isn't applied,
   * or removes it if it is applied.
   * 
   * @param styles - The string of styles currently applied to the `Text`.
   * @param style - The string representing the style to toggle on/off.
   * @returns The new `styles` with `style` toggled on/off.
   */
  function toggleStyle(styles: string, style: string): string {
    return styles.includes(style)
      // Remove style if it is applied
      ? styles.replace(style, "")
      // Add style if it is not applied
      : styles + style;
  }
  
  return (
    <VSpacedDiv>
      <FlexRowDiv>
        <Autocomplete
          className="basis-4/5"
          isClearable={ false }
          isDisabled={ editingField === null }
          label="Font"
          menuTrigger="input"
          onInputChange={(newValue: string): void => {
            if (newValue in DEFAULT_FONT_LIST) {
              updateItem(setNestedValue(editingItem, editingField + ".font", newValue));
            }
          }}
          onSelectionChange={(key: React.Key | null): void => {
            if (editingField && key !== "$.1") {
              updateItem(setNestedValue(editingItem, editingField + ".font", key));
            }
          }}
          radius="sm"
          selectedKey={ getCurrentTextFormatting()?.font ?? null }
        >
          <AutocompleteSection
            items={ BASE_FONTS }
            title="Default Fonts"
          >
            { getAutocompleteItem }
          </AutocompleteSection>
        </Autocomplete>
        <NumberInput
          className="basis-1/5"
          classNames={{
            input: "text"
          }}
          formatOptions={{
            maximumFractionDigits: 0
          }}
          isDisabled={ editingField === null }
          isWheelDisabled
          label="Size"
          minValue={ 1 }
          onValueChange={(newValue: number): void => {
            const INPUT: number = !isNaN(newValue) && newValue > 0
              ? newValue
              : DEFAULT_FONT_SIZE;
            if (editingField) {
              updateItem(setNestedValue(editingItem, editingField + ".size", INPUT));
            }
          }}
          radius="sm"
          value={ getCurrentTextFormatting()?.size ?? DEFAULT_FONT_SIZE }
        />
      </FlexRowDiv>
      <FlexRowDiv className="justify-center">
        <ButtonGroup
          buttons={[
            {
              onPress: (): void => {
                const FORMATTING: TextFormatting | undefined = getCurrentTextFormatting();
                if (FORMATTING) {
                  updateField({
                    ...FORMATTING,
                    style: toggleStyle(FORMATTING.style, "U")
                  });
                }
              },
              pressed: hasStyle("U"),
              text: "U̲"
            },
            {
              onPress: (): void => {
                const FORMATTING: TextFormatting | undefined = getCurrentTextFormatting();
                if (FORMATTING) {
                  updateField({
                    ...FORMATTING,
                    style: toggleStyle(FORMATTING.style, "S")
                  });
                }
              },
              pressed: hasStyle("S"),
              text: "S̶"
            }
          ]}
          disableRipple
          isDisabled={ editingField === null }
          isIconOnly
        />
        <ButtonGroup
          buttons={[
            {
              onPress: (): void => {
                const FORMATTING: TextFormatting | undefined = getCurrentTextFormatting();
                if (FORMATTING) {
                  updateField({
                    ...FORMATTING,
                    hAlign: "left"
                  });
                }
              },
              pressed: isAligned("left"),
              text: "L"
            },
            {
              onPress: (): void => {
                const FORMATTING: TextFormatting | undefined = getCurrentTextFormatting();
                if (FORMATTING) {
                  updateField({
                    ...FORMATTING,
                    hAlign: "center"
                  });
                }
              },
              pressed: isAligned("center"),
              text: "C"
            },
            {
              onPress: (): void => {
                const FORMATTING: TextFormatting | undefined = getCurrentTextFormatting();
                if (FORMATTING) {
                  updateField({
                    ...FORMATTING,
                    hAlign: "right"
                  });
                }
              },
              pressed: isAligned("right"),
              text: "R"
            },
            {
              onPress: (): void => {
                const FORMATTING: TextFormatting | undefined = getCurrentTextFormatting();
                if (FORMATTING) {
                  updateField({
                    ...FORMATTING,
                    hAlign: "justify"
                  });
                }
              },
              pressed: isAligned("justify"),
              text: "J"
            }
          ]}
          canDeselect={ false }
          disableRipple
          isDisabled={ editingField === null }
          isIconOnly
          isRadioGroup
        />
      </FlexRowDiv>
    </VSpacedDiv>
  );
}