import { Input as HeroUIInput, InputProps, Textarea as HeroUITextarea, TextAreaProps } from "@heroui/react";
import { useContext } from "react";
import { EditorContext, type EditorState } from "@/app/contexts/EditorContext";

type CustomInputProps = {
  field?: string
};

export const Input = (props: InputProps & CustomInputProps): React.ReactNode => {

  const INPUT_FIELD: string = props.field ?? "content.body";
  const { setEditingField } = useContext<EditorState>(EditorContext);

  return (
    <HeroUIInput
      { ...props }
      onBlur={(event: React.FocusEvent) => {
        switch (event.relatedTarget?.tagName) {
          case "BUTTON":
            // Do not unfocus
            setTimeout((): void => (event.target as HTMLElement).focus(), 0);
          case "INPUT":
            // Changing `Text` properties
            setEditingField(INPUT_FIELD);
            break;
          default:
            // Actual focus lost
            setEditingField(null);
        }
      }}
      onFocus={ (): void => setEditingField(INPUT_FIELD) }
      radius="sm"
    />
  );
};

export const TextArea = (props: TextAreaProps): React.ReactNode => {

  const { setEditingField } = useContext<EditorState>(EditorContext);

  return (
    <HeroUITextarea
      { ...props }
      onBlur={(event: React.FocusEvent) => {
        switch (event.relatedTarget?.tagName) {
          case "BUTTON":
            // Do not unfocus
            setTimeout((): void => (event.target as HTMLElement).focus(), 0);
          case "INPUT":
            // Changing `Text` properties
            setEditingField("content.body");
            break;
          default:
            // Actual focus lost
            setEditingField(null);
        }
      }}
      onFocus={ (): void => setEditingField("content.body") }
      radius="sm"
    />
  );
};