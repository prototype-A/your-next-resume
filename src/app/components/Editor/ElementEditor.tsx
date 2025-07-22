import { useContext } from "react";
import { NumberInput, Select, SelectItem, type SharedSelection } from "@heroui/react";
import { FlexRowDiv, VSpacedDiv } from "../Containers";
import { Input, TextArea } from "./CustomInputs";
import ReorderableList from "../ReorderableList";
import type { EducationResumeItem, EmploymentResumeItem, MultiItemBodyTextResumeItem, ResumeItem, ResumeItemTextContentType, SetStateFn, TextResumeItem } from "../Types";
import { RESUME_ITEM_TYPES, RESUME_ITEM_TEXT_CONTENT_TYPES, DEFAULT_TEXT, DEFAULT_TEXT_LIST } from "../Types";
import { EditorContext, type EditorState } from "@/app/contexts/EditorContext";
import { mapElementsAsObjects } from "@/app/utils/ArrayUtils";
import { clamp } from "@/app/utils/NumberUtils";
import "@/app/styles/editors.css";
import "@/app/styles/globals.css";

type ResumeItemEditorProps = {
  item: ResumeItem,
  updateItem: SetStateFn<ResumeItem>
};

const DateRange = ({
  item,
  updateItem
}: ResumeItemEditorProps): React.ReactNode => (
  <FlexRowDiv>
    <Input
      classNames={{
        input: "text"
      }}
      field="content.period"
      label="Start Date"
      onValueChange={(newValue: string): void =>
        updateItem((prevState: ResumeItem): ResumeItem => ({
          ...prevState,
          content: {
            ...prevState.content,
            period: {
              ...(prevState as EducationResumeItem | EmploymentResumeItem).content.period,
              startDate: newValue
            }
          }
        }) as EducationResumeItem | EmploymentResumeItem)
      }
      value={ item.type === RESUME_ITEM_TYPES[0] || item.type === RESUME_ITEM_TYPES[1]
        ? item.content.period.startDate
        : ""
      }
      variant="underlined"
    />
    <Input
      classNames={{
        input: "text"
      }}
      field="content.period"
      label="End Date"
      onValueChange={(newValue: string): void =>
        updateItem((prevState: ResumeItem): ResumeItem => ({
          ...prevState,
          content: {
            ...prevState.content,
            period: {
              ...(prevState as EducationResumeItem | EmploymentResumeItem).content.period,
              endDate: newValue
            }
          }
        }) as EducationResumeItem | EmploymentResumeItem)
      }
      value={ item.type === RESUME_ITEM_TYPES[0] || item.type === RESUME_ITEM_TYPES[1]
        ? item.content.period.endDate
        : ""
      }
      variant="underlined"
    />
  </FlexRowDiv>
);

export default function ElementEditor(): React.ReactNode {

  const { editingItem, updateItem } = useContext<EditorState>(EditorContext);
  const TEXT_CONTENT_TYPES: { [key: string]: string }[] = mapElementsAsObjects(
    RESUME_ITEM_TEXT_CONTENT_TYPES as unknown as string[],
    "type"
  );

  function isTextContentType(type: ResumeItemTextContentType): boolean {
    return (editingItem as TextResumeItem | MultiItemBodyTextResumeItem)?.content.type === type;
  }

  return (<>{ editingItem?.type === RESUME_ITEM_TYPES[0] &&
    // Type: "Education"
    <VSpacedDiv>
      <Input
        field="content.institution"
        label="Institution"
        onValueChange={(newValue: string): void =>
          updateItem((prevState: ResumeItem): ResumeItem => ({
            ...prevState,
            content: {
              ...prevState.content,
              institution: {
                ...(prevState as EducationResumeItem).content.institution,
                text: newValue
              }
            }
          }) as EducationResumeItem)
        }
        value={ editingItem.content.institution.text }
      />
      <Input
        field="content.location"
        label="Location"
        onValueChange={(newValue: string): void =>
          updateItem((prevState: ResumeItem): ResumeItem => ({
            ...prevState,
            content: {
              ...prevState.content,
              location: {
                ...(prevState as EducationResumeItem).content.location,
                text: newValue
              }
            }
          }) as EducationResumeItem)
        }
        value={ editingItem.content.location.text }
      />
      <FlexRowDiv>
        <Input
          className="basis-4/5"
          field="content.degree"
          label="Degree"
          onValueChange={(newValue: string): void =>
            updateItem((prevState: ResumeItem): ResumeItem => ({
              ...prevState,
              content: {
                ...prevState.content,
                degree: {
                  ...(prevState as EducationResumeItem).content.degree,
                  text: newValue
                }
              }
            }) as EducationResumeItem)
          }
          value={ editingItem.content.degree.text }
        />
        <NumberInput
          className="basis-1/5"
          classNames={{
            input: "text"
          }}
          formatOptions={{
            maximumFractionDigits: 1
          }}
          hideStepper
          isWheelDisabled
          label="GPA"
          maxValue={ 4 }
          minValue={ 0 }
          onValueChange={(newValue: number): void => {
            const INPUT: number = !isNaN(newValue) ? newValue : 0;
            updateItem((prevState: ResumeItem): ResumeItem => ({
              ...prevState,
              content: {
                ...prevState.content,
                gpa: {
                  ...(prevState as EducationResumeItem).content.gpa,
                  text: clamp(+INPUT, 0, 4).toString()
                }
              }
            }) as EducationResumeItem);
          }}
          radius="sm"
          size="sm"
          value={ Number(editingItem.content.gpa.text) }
          variant="underlined"
        />
      </FlexRowDiv>
      <FlexRowDiv>
        <Input
          field="content.major"
          label="Major"
          onValueChange={(newValue: string): void =>
            updateItem((prevState: ResumeItem): ResumeItem => ({
              ...prevState,
              content: {
                ...prevState.content,
                major: {
                  ...(prevState as EducationResumeItem).content.major,
                  text: newValue
                }
              }
            }) as EducationResumeItem)
          }
          value={ editingItem.content.major.text }
        />
        <Input
          field="content.minor"
          label="Minor"
          onValueChange={(newValue: string): void =>
            updateItem((prevState: ResumeItem): ResumeItem => ({
              ...prevState,
              content: {
                ...prevState.content,
                minor: {
                  ...(prevState as EducationResumeItem).content.minor,
                  text: newValue
                }
              }
            }) as EducationResumeItem)
          }
          value={ editingItem.content.minor.text }
        />
      </FlexRowDiv>
      <DateRange
        item={ editingItem }
        updateItem={ updateItem }
      />
      <ReorderableList
        key={ editingItem.id }
        items={ (editingItem as EducationResumeItem).content.body.text }
        updateList={(updatedList: string[]): void =>
          updateItem((prevState: ResumeItem): ResumeItem => ({
            ...prevState,
            content: {
              ...prevState.content,
              body: {
                ...prevState.content.body,
                text: updatedList
              }
            }
          }) as EducationResumeItem)
        }
      />
    </VSpacedDiv>
  }
  { editingItem?.type === RESUME_ITEM_TYPES[1] &&
    // Type: "Employment"
    <VSpacedDiv>
      <Input
        field="content.position"
        label="Position"
        onValueChange={(newValue: string): void =>
          updateItem((prevState: ResumeItem): ResumeItem => ({
            ...prevState,
            content: {
              ...prevState.content,
              position: {
                ...(prevState as EmploymentResumeItem).content.position,
                text: newValue
              }
            }
          }) as EmploymentResumeItem)
        }
        value={ editingItem.content.position.text }
      />
      <Input
        field="content.company"
        label="Company"
        onValueChange={(newValue: string): void =>
          updateItem((prevState: ResumeItem): ResumeItem => ({
            ...prevState,
            content: {
              ...prevState.content,
              company: {
                ...(prevState as EmploymentResumeItem).content.company,
                text: newValue
              }
            }
          }) as EmploymentResumeItem)
        }
        value={ editingItem.content.company.text }
      />
      <Input
        field="content.location"
        label="Location"
        onValueChange={(newValue: string): void =>
          updateItem((prevState: ResumeItem): ResumeItem => ({
            ...prevState,
            content: {
              ...prevState.content,
              location: {
                ...(prevState as EmploymentResumeItem).content.location,
                text: newValue
              }
            }
          }) as EmploymentResumeItem)
        }
        value={ editingItem.content.location.text }
      />
      <DateRange
        item={ editingItem }
        updateItem={ updateItem }
      />
      <ReorderableList
        key={ editingItem.id }
        items={ (editingItem as EmploymentResumeItem).content.body.text }
        updateList={(updatedList: string[]): void =>
          updateItem((prevState: ResumeItem): ResumeItem => ({
            ...prevState,
            content: {
              ...prevState.content,
              body: {
                ...prevState.content.body,
                text: updatedList
              }
            }
          }) as EmploymentResumeItem)
        }
      />
    </VSpacedDiv>
  }
  { editingItem?.type === RESUME_ITEM_TYPES[2] &&
    // Type: "Text"
    <VSpacedDiv>
      <Input
        field="header"
        label="Header"
        onValueChange={(newValue: string): void =>
          updateItem((prevState: ResumeItem): ResumeItem => ({
            ...prevState,
            header: {
              ...(prevState as TextResumeItem).header,
              text: newValue
            }
          }) as TextResumeItem)
        }
        value={ editingItem.header.text }
      />
      <Select
        // Text Content Dropdown: "Text" | "List" | "Tags"
        items={ TEXT_CONTENT_TYPES }
        label="Content"
        onSelectionChange={(keys: SharedSelection): void => {
          if ((keys as Set<React.Key>).size === 0) {
            // Cannot de-select item
            return;
          }
          const NEW_BODY_TYPE: ResumeItemTextContentType = keys.currentKey as ResumeItemTextContentType;
          updateItem((prevState: ResumeItem): ResumeItem => ({
            ...prevState,
            content: {
              body: NEW_BODY_TYPE === RESUME_ITEM_TEXT_CONTENT_TYPES[0]
                ? DEFAULT_TEXT
                : DEFAULT_TEXT_LIST,
              type: NEW_BODY_TYPE
            }
          }) as TextResumeItem | MultiItemBodyTextResumeItem);
        }}
        selectedKeys={[ editingItem.content.type ]}
        selectionMode="single"
        size="sm"
      >
        { (item: { [key: string]: string }): React.JSX.Element =>
          <SelectItem key={ item.type }>
            { item.type }
          </SelectItem>
        }
      </Select>
      { isTextContentType(RESUME_ITEM_TEXT_CONTENT_TYPES[0]) &&
        // Content: "Text"
        <TextArea
          className="text"
          label="Text"
          minRows={ 6 }
          onValueChange={(newValue: string): void => 
            updateItem((prevState: ResumeItem): ResumeItem => ({
              ...prevState,
              content: {
                ...prevState.content,
                body: {
                  ...prevState.content.body,
                  text: newValue
                }
              }
            }) as TextResumeItem)
          }
          placeholder="Your text here..."
          value={ (editingItem as TextResumeItem).content.body.text }
        />
      }
      { (isTextContentType(RESUME_ITEM_TEXT_CONTENT_TYPES[1]) ||
        isTextContentType(RESUME_ITEM_TEXT_CONTENT_TYPES[2])) &&
        // Content: "List" | "Tags"
        <ReorderableList
          key={ editingItem.id }
          items={ (editingItem as MultiItemBodyTextResumeItem).content.body.text }
          updateList={(updatedList: string[]): void =>
            updateItem((prevState: ResumeItem): ResumeItem => ({
              ...prevState,
              content: {
                ...prevState.content,
                body: {
                  ...prevState.content.body,
                  text: updatedList
                }
              }
            }) as MultiItemBodyTextResumeItem)
          }
        />
      }
    </VSpacedDiv>
  }</>);
}