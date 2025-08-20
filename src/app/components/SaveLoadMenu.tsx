import { addToast, Button, Modal, ModalContent, ToastProvider } from "@heroui/react";
import type { Schema, Template } from "@pdfme/common";
import { BLANK_A4_PDF, px2mm } from "@pdfme/common";
import { generate as generatePDF } from "@pdfme/generator";
import { text as TextPlugin } from "@pdfme/schemas";
import { FlexRowDiv } from "./Containers";
import type { Coordinates, Dimensions, Resume, ResumeItem, ResumePage, SetStateFn, Text, TextList } from "./Types";
import "../styles/layouts.css";
import "../styles/save-menu.css";
import { formatGPAText, formatPeriodText } from "../utils/FormattingUtils";

type SaveLoadMenuProps = {
  isOpen: boolean,
  onOpenChange: () => void,
  state: Resume,
  setState: SetStateFn<Resume>
};

export default function SaveLoadMenu({
  isOpen,
  onOpenChange,
  state,
  setState
}: SaveLoadMenuProps): React.ReactNode {

  const TEXT_SIZE_OFFSET: number = 4;

  /**
   * Calculates and returns the amount of vertical space to separate a
   * `Schema` by based on the text styling of the specified `Text`.
   * 
   * @param text - The text and its styling to calculate the spacing with.
   * @returns The calculated amount of vertical separation space.
   */
  function addYSpacing(text: Text): number {
    return text.text !== ""
      ? text.size + text.size / 2
      : 0;
  }
  
  /**
   * Generates a timestamped file name with the specified `extension`.
   * 
   * @param extension - The extension of the file.
   * @returns The name of the file with the current timestamp.
   */
  function generateFileNameWithExtension(extension: string): string {
    const DL_TIME: string = new Date()
      .toISOString();
    return `Resume-${DL_TIME}.${extension}`;
  }

  /**
   * Returns a `Schema` object to be rendered on a PDF document.
   * 
   * @param text - The text to render with its formatting and styling.
   * @param position - The x and y position to render the schema at
   * from the top-left corner (in mm).
   * @param size - The width and height of the schema (in mm).
   * @returns The schema to render on the document.
   */
  function generateSchemaElement(
    name: string,
    text: Text | TextList,
    position: Coordinates,
    size: Dimensions,
    type: string = "text"
  ): Schema {
    return {
      alignment: text.hAlign,
      content: Array.isArray(text.text)
        ? text.text.length > 0
          ? `• ${text.text.join("\n• ")}`
          : ""
        : text.text,
      fontName: text.font,
      fontSize: text.size > TEXT_SIZE_OFFSET
        ? text.size - TEXT_SIZE_OFFSET
        : 1,
      height: size.height,
      lineHeight: 1.2,
      name,
      position,
      readOnly: true,
      strikethrough: text.style.includes("S"),
      type,
      underline: text.style.includes("U"),
      verticalAlignment: "top",
      width: size.width
    };
  }

  /**
   * Triggers a browser download to save the specified 
   * data into a file.
   * 
   * @param data - The data to save into a file.
   * @param type - The MIME type of the file.
   * @param filename - The name of the file to save as.
   */
  function saveAsFile(data: BlobPart, type: string, filename: string): void {
    const BLOB: Blob = new Blob(
      [ data ],
      { type: type }
    );
    const DL_LINK: HTMLAnchorElement = document.createElement("a");
    DL_LINK.href = URL.createObjectURL(BLOB);
    DL_LINK.download = filename;
    DL_LINK.click();
    URL.revokeObjectURL(DL_LINK.href);
  }

  return (<>
    <ToastProvider placement={ "top-left" } toastOffset={ 80 } />
    <Modal
      className="max-w-160"
      hideCloseButton
      isOpen={ isOpen }
      onOpenChange={ onOpenChange }
      placement="top"
      radius="sm"
      shadow="none"
      shouldBlockScroll={ false }
    >
      <ModalContent className="button-container flex-row drop-shadow-2xl">
        {(onClose): React.ReactNode => 
          <FlexRowDiv className="justify-center overflow-hidden w-full">
            <Button
              className="save-button"
              onPress={(): void => {
                // Download as JSON file
                saveAsFile(
                  JSON.stringify(state, null, 2),
                  "application/json",
                  generateFileNameWithExtension("json")
                );
                // Close modal
                onClose();
              }}
              radius="sm"
            >
              { "Save JSON" }
            </Button>
            <Button
              className="save-button"
              onPress={(): void => {
                // Prompt for file input
                const FILE_INPUT: HTMLInputElement = document.createElement("input");
                FILE_INPUT.type = "file";
                FILE_INPUT.accept = "application/json";
                FILE_INPUT.addEventListener("change", async (event: Event): Promise<void> => {
                  const FILE: File = (event.target as HTMLInputElement).files![0];
                  try {
                    // Parse file
                    const RESUME: Resume = JSON.parse(await FILE.text());
                    // Load resume state
                    setState(RESUME);
                    // Close modal
                    onClose();
                  } catch (error: any) {
                    // Failed to load from file
                    const ERROR_MSG: string = `Failed to load "${FILE.name}"`;
                    console.error(`${ERROR_MSG}.\n${error}`);
                    // Display error
                    addToast({
                      classNames: {
                        base: "bg-white border-danger border-l-12 border-l-danger",
                        icon: "toast-icon"
                      },
                      color: "danger",
                      description: ERROR_MSG,
                      radius: "sm",
                      severity: "default",
                      shadow: "lg",
                      title: "Error"
                    });
                  }
                })
                // Open dialog to upload JSON
                FILE_INPUT.click();
              }}
              radius="sm"
            >
              { "Load JSON" }
            </Button>
            <Button
              className="save-button"
              onPress={(): void => {
                // Create PDF
                const SCHEMAS: Schema[][] = state.pages.map((page: ResumePage): Schema[] => {
                  const PAGE_SCHEMAS: Schema[] = [];
                  page.items.forEach((item: ResumeItem): void => {
                    let spacing: number = 0;
                    switch (item.type) {
                      case "Education":
                        PAGE_SCHEMAS.push(generateSchemaElement(
                          `${item.id}_institution`,
                          item.content.institution,
                          {
                            x: px2mm(item.position.x),
                            y: px2mm(item.position.y)
                          },
                          {
                            height: px2mm(item.content.institution.size),
                            width: px2mm(item.size.width)
                          }
                        ));
                        spacing += addYSpacing(item.content.institution);
                        PAGE_SCHEMAS.push(generateSchemaElement(
                          `${item.id}_location`,
                          item.content.location,
                          {
                            x: px2mm(item.position.x),
                            y: px2mm(item.position.y + spacing)
                          },
                          {
                            height: px2mm(item.content.location.size),
                            width: px2mm(item.size.width)
                          }
                        ));
                        spacing += addYSpacing(item.content.location);
                        PAGE_SCHEMAS.push(generateSchemaElement(
                          `${item.id}_degree`,
                          item.content.degree,
                          {
                            x: px2mm(item.position.x),
                            y: px2mm(item.position.y + spacing)
                          },
                          {
                            height: px2mm(item.content.degree.size),
                            width: px2mm(item.size.width)
                          }
                        ));
                        spacing += addYSpacing(item.content.degree);
                        PAGE_SCHEMAS.push(generateSchemaElement(
                          `${item.id}_major`,
                          item.content.major.text !== ""
                            ? {
                                ...item.content.major,
                                text: `Major: ${item.content.major.text}`
                              }
                            : item.content.major,
                          {
                            x: px2mm(item.position.x),
                            y: px2mm(item.position.y + spacing)
                          },
                          {
                            height: px2mm(item.content.major.size),
                            width: px2mm(item.size.width)
                          }
                        ));
                        spacing += addYSpacing(item.content.major);
                        PAGE_SCHEMAS.push(generateSchemaElement(
                          `${item.id}_minor`,
                          item.content.minor.text !== ""
                            ? {
                                ...item.content.minor,
                                text: `Minor: ${item.content.minor.text}`
                              }
                            : item.content.minor,
                          {
                            x: px2mm(item.position.x),
                            y: px2mm(item.position.y + spacing)
                          },
                          {
                            height: px2mm(item.content.minor.size),
                            width: px2mm(item.size.width)
                          }
                        ));
                        spacing += addYSpacing(item.content.minor);
                        const EDUCATION_PERIOD_TEXT: Text = {
                          ...item.content.period,
                          text: formatPeriodText(item.content.period)
                        };
                        PAGE_SCHEMAS.push(generateSchemaElement(
                          `${item.id}_period`,
                          EDUCATION_PERIOD_TEXT,
                          {
                            x: px2mm(item.position.x),
                            y: px2mm(item.position.y + spacing)
                          },
                          {
                            height: px2mm(item.content.period.size),
                            width: px2mm(item.size.width)
                          }
                        ));
                        spacing += addYSpacing(EDUCATION_PERIOD_TEXT);
                        const GPA_TEXT: Text = {
                          ...item.content.gpa,
                          text: formatGPAText(item.content.gpa)
                        };
                        PAGE_SCHEMAS.push(generateSchemaElement(
                          `${item.id}_gpa`,
                          GPA_TEXT,
                          {
                            x: px2mm(item.position.x),
                            y: px2mm(item.position.y + spacing)
                          },
                          {
                            height: px2mm(item.content.gpa.size),
                            width: px2mm(item.size.width)
                          }
                        ));
                        spacing += addYSpacing(GPA_TEXT);
                        PAGE_SCHEMAS.push(generateSchemaElement(
                          `${item.id}_body`,
                          item.content.body,
                          {
                            x: px2mm(item.position.x),
                            y: px2mm(item.position.y + spacing)
                          },
                          {
                            height: px2mm(item.content.body.size *
                              item.content.body.text.length +
                              item.content.body.size / 2),
                            width: px2mm(item.size.width)
                          }
                        ));
                        break;
                      case "Employment":
                        PAGE_SCHEMAS.push(generateSchemaElement(
                          `${item.id}_position`,
                          item.content.position,
                          {
                            x: px2mm(item.position.x),
                            y: px2mm(item.position.y)
                          },
                          {
                            height: px2mm(item.content.position.size),
                            width: px2mm(item.size.width)
                          }
                        ));
                        spacing += addYSpacing(item.content.position);
                        PAGE_SCHEMAS.push(generateSchemaElement(
                          `${item.id}_company`,
                          item.content.company,
                          {
                            x: px2mm(item.position.x),
                            y: px2mm(item.position.y + spacing)
                          },
                          {
                            height: px2mm(item.content.company.size),
                            width: px2mm(item.size.width)
                          }
                        ));
                        spacing += addYSpacing(item.content.company);
                        PAGE_SCHEMAS.push(generateSchemaElement(
                          `${item.id}_location`,
                          item.content.location,
                          {
                            x: px2mm(item.position.x),
                            y: px2mm(item.position.y + spacing)
                          },
                          {
                            height: px2mm(item.content.location.size),
                            width: px2mm(item.size.width)
                          }
                        ));
                        spacing += addYSpacing(item.content.location);
                        const EMPLOYMENT_PERIOD_TEXT: Text = {
                          ...item.content.period,
                          text: formatPeriodText(item.content.period)
                        };
                        PAGE_SCHEMAS.push(generateSchemaElement(
                          `${item.id}_period`,
                          EMPLOYMENT_PERIOD_TEXT,
                          {
                            x: px2mm(item.position.x),
                            y: px2mm(item.position.y + spacing)
                          },
                          {
                            height: px2mm(item.content.period.size),
                            width: px2mm(item.size.width)
                          }
                        ));
                        spacing += addYSpacing(EMPLOYMENT_PERIOD_TEXT);
                        PAGE_SCHEMAS.push(generateSchemaElement(
                          `${item.id}_body`,
                          item.content.body,
                          {
                            x: px2mm(item.position.x),
                            y: px2mm(item.position.y + spacing)
                          },
                          {
                            height: px2mm(item.content.body.size *
                              item.content.body.text.length +
                              item.content.body.size / 2),
                            width: px2mm(item.size.width)
                          }
                        ));
                        break;
                      case "Text":
                        PAGE_SCHEMAS.push(generateSchemaElement(
                          `${item.id}_header`,
                          item.header,
                          {
                            x: px2mm(item.position.x),
                            y: px2mm(item.position.y)
                          },
                          {
                            height: px2mm(item.header.size),
                            width: px2mm(item.size.width)
                          }
                        ));
                        spacing += addYSpacing(item.header);
                        if (item.content.type === "List") {
                          PAGE_SCHEMAS.push(generateSchemaElement(
                            `${item.id}_body`,
                            item.content.body,
                            {
                              x: px2mm(item.position.x),
                              y: px2mm(item.position.y + spacing)
                            },
                            {
                              height: px2mm(item.content.body.size *
                                item.content.body.text.length +
                                item.content.body.size / 2),
                              width: px2mm(item.size.width)
                            }
                          ));
                        } else if (item.content.type === "Tags") {
                          PAGE_SCHEMAS.push(generateSchemaElement(
                            `${item.id}_body`,
                            {
                              ...item.content.body,
                              text: item.content.body.text.join(", ")
                            },
                            {
                              x: px2mm(item.position.x),
                              y: px2mm(item.position.y + spacing)
                            },
                            {
                              height: px2mm(item.size.height),
                              width: px2mm(item.size.width)
                            }
                          ));
                        } else {
                          // item.content.type === "Text"
                          PAGE_SCHEMAS.push(generateSchemaElement(
                            `${item.id}_body`,
                            item.content.body,
                            {
                              x: px2mm(item.position.x),
                              y: px2mm(item.position.y + spacing)
                            },
                            {
                              height: px2mm(item.size.height),
                              width: px2mm(item.size.width)
                            }
                          ));
                        }
                    }
                  });
                  return PAGE_SCHEMAS;
                });
                const PDF_TEMPLATE: Template = {
                  basePdf: state.size === "a4"
                    ? {
                        ...BLANK_A4_PDF
                      }
                    : {
                        height: 279.4,
                        padding: [ 20, 20, 20, 20 ],
                        width: 215.9
                      },
                  schemas: SCHEMAS
                }
                // Export PDF
                generatePDF({
                  inputs: [ {} ],
                  plugins: {
                    TextPlugin
                  },
                  template: PDF_TEMPLATE
                }).then((pdfBytes: Uint8Array): void => {
                  saveAsFile(
                    pdfBytes,
                    "application/pdf",
                    generateFileNameWithExtension("pdf")
                  );
                });
              }}
              radius="sm"
            >
              { "Export PDF" }
            </Button>
          </FlexRowDiv>
        }
      </ModalContent>
    </Modal>
  </>);
}