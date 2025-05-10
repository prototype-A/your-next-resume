import { Button } from "@heroui/react";
import { nanoid } from "nanoid/non-secure";
import { useContext, useRef } from "react";
import { ContextMenuContext, ContextMenuContextProvider } from "../contexts/ContextMenuContext";
import ResumeElement from "./ResumeElement";
import type { Coordinates, PaperSize, Resume, ResumeItem, ResumePage, SetStateFn } from "./Types";
import { DEFAULT_RESUME_PAGE } from "./Types";
import { removeAtIndex } from "../utils/ArrayUtils";
import "../styles/layouts.css";
import "../styles/page.css";

type PageProps = {
  resumePage: ResumePage,
  setResumeState: SetStateFn<Resume>,
  size: PaperSize
};

function Page({
  resumePage,
  setResumeState,
  size
}: PageProps): React.ReactNode {

  const pageRef = useRef<HTMLDivElement>(null);
  const showContextMenu = useContext(ContextMenuContext);
  const ELEM_ID_LENGTH: number = 8;

  function addItem(newItem: ResumeItem) {
    setResumeState((prevState: Resume): Resume => ({
      ...prevState,
      pages: prevState.pages.map((page: ResumePage): ResumePage => {
        if (resumePage.id === page.id) {
          return {
            ...page,
            items: [ ...page.items, newItem ]
          };
        }
        return page;
      })
    }))
  }

  return (
    <div
      className={ "page relative " + (size === "a4"
        ? "page-a4"
        : "page-letter"
      )}
      onContextMenu={(event: React.MouseEvent): void => {
        // Do not display the browser's or any other context menu
        event.preventDefault();
        event.stopPropagation();

        const MOUSE_POS: Coordinates = { x: event.clientX, y: event.clientY };
        showContextMenu(MOUSE_POS, [
          {
            onPress: (): void => addItem({
              id: nanoid(ELEM_ID_LENGTH),
              position: MOUSE_POS,
              size: { height: 200, width: 320 },
              type: "Text"
            }),
            text: "New Text Item"
          },
          {
            onPress: (): void => addItem({
              id: nanoid(ELEM_ID_LENGTH),
              position: MOUSE_POS,
              size: { height: 300, width: 600 },
              type: "Employment"
            }),
            text: "New Employment Item"
          },
          {
            onPress: (): void => addItem({
              id: nanoid(ELEM_ID_LENGTH),
              position: MOUSE_POS,
              size: { height: 300, width: 600 },
              type: "Education"
            }),
            text: "New Education Item"
          }
        ]);
      }}
      ref={ pageRef }
    >
      { resumePage.items.map((item: ResumeItem): React.ReactNode => 
        <ResumeElement
          deleteItem={(itemToDelete: ResumeItem): void => 
            setResumeState((prevState: Resume): Resume => ({
              ...prevState,
              pages: prevState.pages.map((page: ResumePage): ResumePage => {
                if (resumePage.id !== page.id) {
                  return page;
                }
                return {
                  ...page,
                  items: page.items.filter((item: ResumeItem) => itemToDelete.id !== item.id)
                };
              })
            }))
          }
          dragBounds={ pageRef }
          item={ item }
          key={ `item${item.id}` }
          updateItem={(updatedItem: ResumeItem): void => 
            setResumeState((prevState: Resume): Resume => ({
              ...prevState,
              pages: prevState.pages.map((page: ResumePage): ResumePage => {
                if (resumePage.id !== page.id) {
                  return page;
                }
                return {
                  ...page,
                  items: page.items.map((item: ResumeItem): ResumeItem => {
                    if (updatedItem.id === item.id) {
                      return updatedItem;
                    }
                    return item;
                  })
                };
              })
            }))
          }
        />
      )}
    </div>
  );
}

type PageEditorProps = {
  resume: Resume,
  setResumeState: SetStateFn<Resume>
}

export default function PageEditor({
  resume,
  setResumeState
}: PageEditorProps): React.ReactNode {
  return (
    <ContextMenuContextProvider>
      <div
        className={ "flex-column justify-center w-full " + (resume.size === "a4"
          ? "max-w-(--a4-width)"
          : "max-w-(--letter-width)"
        )}
      >
        { resume.pages.map((resumePage: ResumePage, pageNum: number): React.ReactNode => 
          <div key={ `page-${pageNum}_${resumePage.id}` }>
            { /* Remove page button */ }
            { pageNum >= 1 &&
              <Button
                className="button"
                onPress={(): void => 
                  // Delete page
                  setResumeState((prevState: Resume): Resume => ({
                    ...prevState,
                    pages: removeAtIndex(prevState.pages, pageNum)
                  }))
                }
                radius="sm"
              >
                { "-" }
              </Button>
            }
            { /* Page */ }
            <Page
              resumePage={ resumePage }
              setResumeState={ setResumeState }
              size={ resume.size }
            />
          </div>
        )}
        { /* Add page button */ }
        <Button
          className="button"
          onPress={(): void => 
            // Add a new page
            setResumeState((prevState: Resume): Resume => ({
              ...prevState,
              pages: [
                ...resume.pages,
                {
                  ...DEFAULT_RESUME_PAGE,
                  id: nanoid(5)
                }
              ]
            }))
          }
          radius="sm"
        >
          { "+" }
        </Button>
      </div>
    </ContextMenuContextProvider>
  );
};
