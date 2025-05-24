import { addToast, Button, Modal, ModalContent, ToastProvider } from "@heroui/react";
import type { Resume, SetStateFn } from "./Types";
import "../styles/layouts.css";
import "../styles/save-menu.css";

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

  /**
   * Generates a timestamped file name.
   * 
   * @param extension - The extension of the file.
   * @returns The name of the file with the current timestamp.
   */
  function generateFileName(extension: string): string {
    const DL_TIME: string = new Date()
      .toISOString();
    return `Resume-${DL_TIME}.${extension}`;
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
          <div className="flex-row justify-center overflow-hidden w-full">
            <Button
              className="save-button"
              onPress={(): void => {
                // Download as JSON file
                saveAsFile(JSON.stringify(state, null, 2), "application/json", generateFileName("json"));
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
                FILE_INPUT.click();
              }}
              radius="sm"
            >
              { "Load JSON" }
            </Button>
          </div>
        }
      </ModalContent>
    </Modal>
  </>);
}