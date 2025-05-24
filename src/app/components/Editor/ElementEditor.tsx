import { useContext } from "react";
import { Card, CardBody, Input, NumberInput, Select, SelectItem, type SharedSelection, Textarea } from "@heroui/react";
import { FlexRowDiv, VSpacedDiv } from "../Containers";
import ReorderableList from "../ReorderableList";
import type { EducationResumeItem, EmploymentResumeItem, MultiItemBodyTextResumeItem, ResumeItem, ResumeItemTextContentType, SetStateFn, TextResumeItem } from "../Types";
import { ResumeItemTextContentTypes, ResumeItemTypes } from "../Types";
import { EditorContext } from "@/app/contexts/EditorContext";
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
      label="Start Date"
      onValueChange={(newValue: string): void =>
        updateItem((prevState: ResumeItem): ResumeItem => ({
          ...prevState,
          content: {
            ...prevState.content,
            startDate: newValue
          }
        }) as EducationResumeItem | EmploymentResumeItem)
      }
      radius="sm"
      size="sm"
      value={ item.type === ResumeItemTypes[0] || item.type === ResumeItemTypes[1] ? item.content.startDate : "" }
      variant="underlined"
    />
    <Input
      classNames={{
        input: "text"
      }}
      label="End Date"
      onValueChange={(newValue: string): void =>
        updateItem((prevState: ResumeItem): ResumeItem => ({
          ...prevState,
          content: {
            ...prevState.content,
            endDate: newValue
          }
        }) as EducationResumeItem | EmploymentResumeItem)
      }
      radius="sm"
      size="sm"
      value={ item.type === ResumeItemTypes[0] || item.type === ResumeItemTypes[1] ? item.content.endDate : "" }
      variant="underlined"
    />
  </FlexRowDiv>
);

export default function ElementEditor(): React.ReactNode {

  const { editingItem, updateItem } = useContext(EditorContext);
  const TEXT_CONTENT_TYPES: { [key: string]: string }[] = mapElementsAsObjects(
    ResumeItemTextContentTypes as unknown as string[],
    "type"
  );

  function isTextContentType(type: ResumeItemTextContentType): boolean {
    return (editingItem as TextResumeItem)?.content.type === type;
  }

  return (
    <Card className="editor-panel">
      <CardBody>
        { editingItem?.type === ResumeItemTypes[0] &&
          // Type: "Education"
          <VSpacedDiv>
            <Input
              label="Institution"
              onValueChange={(newValue: string): void =>
                updateItem((prevState: ResumeItem): ResumeItem => ({
                  ...prevState,
                  content: {
                    ...prevState.content,
                    institution: newValue
                  }
                }) as EducationResumeItem)
              }
              radius="sm"
              size="sm"
              value={ editingItem.content.institution }
            />
            <Input
              label="Location"
              onValueChange={(newValue: string): void =>
                updateItem((prevState: ResumeItem): ResumeItem => ({
                  ...prevState,
                  content: {
                    ...prevState.content,
                    location: newValue
                  }
                }) as EducationResumeItem)
              }
              radius="sm"
              size="sm"
              value={ editingItem.content.location }
            />
            <FlexRowDiv>
              <Input
                className="basis-4/5"
                label="Degree"
                onValueChange={(newValue: string): void =>
                  updateItem((prevState: ResumeItem): ResumeItem => ({
                    ...prevState,
                    content: {
                      ...prevState.content,
                      degree: newValue
                    }
                  }) as EducationResumeItem)
                }
                radius="sm"
                size="sm"
                value={ editingItem.content.degree }
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
                  const INPUT = !isNaN(newValue) ? newValue : 0
                  updateItem((prevState: ResumeItem): ResumeItem => ({
                    ...prevState,
                    content: {
                      ...prevState.content,
                      gpa: clamp(+INPUT, 0, 4)
                    }
                  }) as EducationResumeItem);
                }}
                radius="sm"
                size="sm"
                value={ editingItem.content.gpa }
                variant="underlined"
              />
            </FlexRowDiv>
            <FlexRowDiv>
              <Input
                label="Major"
                onValueChange={(newValue: string): void =>
                  updateItem((prevState: ResumeItem): ResumeItem => ({
                    ...prevState,
                    content: {
                      ...prevState.content,
                      major: newValue
                    }
                  }) as EducationResumeItem)
                }
                radius="sm"
                size="sm"
                value={ editingItem.content.major }
              />
              <Input
                label="Minor"
                onValueChange={(newValue: string): void =>
                  updateItem((prevState: ResumeItem): ResumeItem => ({
                    ...prevState,
                    content: {
                      ...prevState.content,
                      minor: newValue
                    }
                  }) as EducationResumeItem)
                }
                radius="sm"
                size="sm"
                value={ editingItem.content.minor }
              />
            </FlexRowDiv>
            <DateRange
              item={ editingItem }
              updateItem={ updateItem }
            />
            <ReorderableList
              updateList={(updatedList: string[]): void =>
                updateItem((prevState: ResumeItem): ResumeItem => ({
                  ...prevState,
                  content: {
                    ...prevState.content,
                    body: updatedList
                  }
                }) as EducationResumeItem)
              }
            />
          </VSpacedDiv>
        }
        { editingItem?.type === ResumeItemTypes[1] &&
          // Type: "Employment"
          <VSpacedDiv>
            <Input
              label="Position"
              onValueChange={(newValue: string): void =>
                updateItem((prevState: ResumeItem): ResumeItem => ({
                  ...prevState,
                  content: {
                    ...prevState.content,
                    position: newValue
                  }
                }) as EmploymentResumeItem)
              }
              radius="sm"
              size="sm"
              value={ editingItem.content.position }
            />
            <Input
              label="Company"
              onValueChange={(newValue: string): void =>
                updateItem((prevState: ResumeItem): ResumeItem => ({
                  ...prevState,
                  content: {
                    ...prevState.content,
                    company: newValue
                  }
                }) as EmploymentResumeItem)
              }
              radius="sm"
              size="sm"
              value={ editingItem.content.company }
            />
            <Input
              label="Location"
              onValueChange={(newValue: string): void =>
                updateItem((prevState: ResumeItem): ResumeItem => ({
                  ...prevState,
                  content: {
                    ...prevState.content,
                    location: newValue
                  }
                }) as EmploymentResumeItem)
              }
              radius="sm"
              size="sm"
              value={ editingItem.content.location }
            />
            <DateRange
              item={ editingItem }
              updateItem={ updateItem }
            />
            <ReorderableList
              updateList={(updatedList: string[]): void =>
                updateItem((prevState: ResumeItem): ResumeItem => ({
                  ...prevState,
                  content: {
                    ...prevState.content,
                    body: updatedList
                  }
                }) as EmploymentResumeItem)
              }
            />
          </VSpacedDiv>
        }
        { editingItem?.type === ResumeItemTypes[2] &&
          // Type: "Text"
          <VSpacedDiv>
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
                const IS_LIST_TYPE: boolean = editingItem.content.type === ResumeItemTextContentTypes[1] || editingItem.content.type === ResumeItemTextContentTypes[2];
                updateItem((prevState: ResumeItem): ResumeItem => ({
                  ...prevState,
                  content: {
                    body: NEW_BODY_TYPE === ResumeItemTextContentTypes[0]
                      ? ""
                      : IS_LIST_TYPE
                      ? prevState.content.body
                      : [] as string[],
                    type: NEW_BODY_TYPE
                  }
                }) as TextResumeItem);
              }}
              selectedKeys={[ editingItem.content.type ]}
              selectionMode="single"
              size="sm"
            >
              { (item) =>
                <SelectItem key={ item.type }>
                  { item.type }
                </SelectItem>
              }
            </Select>
            { isTextContentType(ResumeItemTextContentTypes[0]) &&
              // Content: "Text"
              <Textarea
                className="text"
                label="Text"
                minRows={ 5 }
                onValueChange={(newValue: string): void => 
                  updateItem((prevState: ResumeItem): ResumeItem => ({
                    ...prevState,
                    content: {
                      ...prevState.content,
                      body: newValue
                    }
                  }) as TextResumeItem)
                }
                placeholder="Your text here..."
                value={ editingItem.content.body as string }
              />
            }
            { (isTextContentType(ResumeItemTextContentTypes[1]) ||
              isTextContentType(ResumeItemTextContentTypes[2])) &&
              // Content: "List" | "Tags"
              <ReorderableList
                items={ editingItem.content.body as string[] }
                updateList={(updatedList: string[]): void =>
                  updateItem((prevState: ResumeItem): ResumeItem => ({
                    ...prevState,
                    content: {
                      ...prevState.content,
                      body: updatedList
                    }
                  }) as MultiItemBodyTextResumeItem)
                }
              />
            }
          </VSpacedDiv>
        }
      </CardBody>
    </Card>
  );
}