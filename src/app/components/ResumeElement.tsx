import { useContext, useEffect, useState } from "react";
import type { Coordinates, Dimensions, Ref, ResumeItem, ResumeItemDateRange, SetStateFn, TextFormatting, TextList } from "./Types";
import { DEFAULT_COORDINATES, DEFAULT_DIMENSIONS, RESUME_ITEM_TEXT_CONTENT_TYPES, RESUME_ITEM_TYPES } from "./Types";
import { ContextMenuContext, type DisplayContextMenuFn } from "../contexts/ContextMenuContext";
import { EditorContext, type EditorState } from "../contexts/EditorContext";
import useEventListener from "../hooks/useEventListener";
import useMousePosition from "../hooks/useMousePosition";
import { clamp } from "../utils/NumberUtils";
import { optionalPrefix } from "../utils/StringUtils";
import "../styles/globals.css";
import "../styles/page.css";
import "../styles/resume-element.css";
import { formatGPAText, formatPeriodText } from "../utils/FormattingUtils";

type ElementResizeProps = {
  hideEditor: (hide: boolean) => void,
  mouseDelta: Coordinates,
  resizeBounds: Ref<HTMLElement>,
  setPosition: SetStateFn<Coordinates>,
  setSize: SetStateFn<Dimensions>,
  show: boolean
};

function ElementHandles({
  hideEditor,
  mouseDelta,
  resizeBounds,
  setPosition,
  setSize,
  show = false
}: ElementResizeProps): React.ReactNode {

  enum Direction { NW, N, NE, W, E, SW, S, SE };
  const [ resizing, setResizing ] = useState<boolean>(false);
  const [ resizeDir, setResizeDir ] = useState<Direction>();
  const [ boundCorrection, setBoundCorrection ] = useState<Dimensions>(
    DEFAULT_DIMENSIONS
  );
  const MIN_SIZE: number = 15;

  /**
   * Allow element to be resized when "mousedown" event is
   * triggered on a resize handle.
   * 
   * @param event - "mousedown" event data.
   * @param direction - The direction to resize.
   */
  function startResizing(event: React.MouseEvent, direction: Direction): void {
    // Prevent moving element when resizing
    event.preventDefault();
    event.stopPropagation();
    // Set resizing states
    setResizing(true);
    setResizeDir(direction);
  }

  // Stop resizing if mousedown released outside of element
  useEventListener("mouseup", (): void => {
    setResizing(false);
    setBoundCorrection(DEFAULT_DIMENSIONS);
    // Show editor after stopping resizing
    hideEditor(false);
  });

  // Handle resizing element
  useEffect((): void => {
    if (resizing) {
      // Hide editor while resizing element
      hideEditor(true);
      // Set element size
      const MAX_HEIGHT: number = resizeBounds.current?.clientHeight ?? 0;
      const MAX_WIDTH: number = resizeBounds.current?.clientWidth ?? 0;
      setSize((prevSize: Dimensions): Dimensions => {
        const NEW_SIZE: Dimensions = {
          height: prevSize.height,
          width: prevSize.width
        };
        // Move element if necessary when resizing since position is top left of element
        setPosition((prevPos: Coordinates): Coordinates => {
          const NEW_POS: Coordinates = {
            x: prevPos.x,
            y: prevPos.y
          };
          switch (resizeDir) {
            case Direction.NW:
              NEW_SIZE.height -= mouseDelta.y;
              NEW_SIZE.width -= mouseDelta.x;
              if (NEW_SIZE.height > MIN_SIZE && boundCorrection.height == 0) {
                NEW_POS.y += mouseDelta.y / 2;
              }
              if (NEW_SIZE.width > MIN_SIZE && boundCorrection.width == 0) {
                NEW_POS.x += mouseDelta.x / 2;
              }
              break;
            case Direction.N:
              NEW_SIZE.height -= mouseDelta.y;
              if (NEW_SIZE.height > MIN_SIZE && boundCorrection.height == 0) {
                NEW_POS.y += mouseDelta.y / 2;
              }
              break;
            case Direction.NE:
              NEW_SIZE.height -= mouseDelta.y;
              NEW_SIZE.width += mouseDelta.x;
              if (NEW_SIZE.height > MIN_SIZE && boundCorrection.height == 0) {
                NEW_POS.y += mouseDelta.y / 2;
              }
              break;
            case Direction.W:
              NEW_SIZE.width -= mouseDelta.x;
              if (NEW_SIZE.width > MIN_SIZE && boundCorrection.width == 0) {
                NEW_POS.x += mouseDelta.x / 2;
              }
              break;
            case Direction.E:
              NEW_SIZE.width += mouseDelta.x;
              break;
            case Direction.SW:
              NEW_SIZE.height += mouseDelta.y;
              NEW_SIZE.width -= mouseDelta.x;
              if (NEW_SIZE.width > MIN_SIZE && boundCorrection.width == 0) {
                NEW_POS.x += mouseDelta.x / 2;
              }
              break;
            case Direction.S:
              NEW_SIZE.height += mouseDelta.y;
              break;
            case Direction.SE:
              NEW_SIZE.height += mouseDelta.y;
              NEW_SIZE.width += mouseDelta.x;
          }
          NEW_POS.x = clamp(NEW_POS.x, 0, MAX_WIDTH, NEW_SIZE.width - NEW_SIZE.width / 2);
          NEW_POS.y = clamp(NEW_POS.y, 0, MAX_HEIGHT, NEW_SIZE.height - NEW_SIZE.height / 2);
          // Correct mouse position to resize handle when resizing outside of bounded area
          let correctedHeight: number = boundCorrection.height != 0
            ? prevSize.height
            : NEW_SIZE.height;
          let correctedWidth: number = boundCorrection.width != 0
            ? prevSize.width
            : NEW_SIZE.width;
          setBoundCorrection((prevBC: Dimensions): Dimensions => {
            const NEW_BC_STATE: Dimensions = {
              height: NEW_SIZE.height < MIN_SIZE ||
                  NEW_POS.y <= 0 && (
                    resizeDir === Direction.NW ||
                    resizeDir === Direction.N ||
                    resizeDir === Direction.NE) ||
                  NEW_SIZE.height + NEW_POS.y > MAX_HEIGHT && (
                    resizeDir === Direction.SW ||
                    resizeDir === Direction.S ||
                    resizeDir === Direction.SE) ||
                  prevBC.height != 0
                ? prevBC.height + mouseDelta.y
                : prevBC.height,
              width: NEW_SIZE.width < MIN_SIZE ||
                  NEW_POS.x <= 0 && (
                    resizeDir === Direction.NW ||
                    resizeDir === Direction.W ||
                    resizeDir === Direction.SW) ||
                  NEW_SIZE.width + NEW_POS.x > MAX_WIDTH &&
                    (resizeDir === Direction.NE ||
                    resizeDir === Direction.E ||
                    resizeDir === Direction.SE) ||
                  prevBC.width != 0
                ? prevBC.width + mouseDelta.x
                : prevBC.width
            };
            // When mouse returns to bounded area
            if (prevBC.height < 0 && NEW_BC_STATE.height > 0 ||
                prevBC.height > 0 && NEW_BC_STATE.height < 0) {
              correctedHeight += NEW_BC_STATE.height;
              NEW_BC_STATE.height = 0;
            }
            if (prevBC.width < 0 && NEW_BC_STATE.width > 0 ||
                prevBC.width > 0 && NEW_BC_STATE.width < 0) {
              correctedWidth += NEW_BC_STATE.width;
              NEW_BC_STATE.width = 0;
            }
            return NEW_BC_STATE;
          });
          NEW_SIZE.height = clamp(correctedHeight, MIN_SIZE, MAX_HEIGHT, NEW_POS.y);
          NEW_SIZE.width = clamp(correctedWidth, MIN_SIZE, MAX_WIDTH, NEW_POS.x);
          return NEW_POS;
        });
        return NEW_SIZE;
      });
    }
  }, [ mouseDelta ]);

  return (
    <div
      className={ "handles " + (show ? "selected" : "") }
    >
      <div
        // Top-middle rotate
        className="handle cursor-grab left-1/2 -top-[8em] -translate-x-1/2"
        onMouseDown={(event: React.MouseEvent): void => {}}
      />
      <div
        // Top-left resize
        className="handle cursor-nw-resize -left-1 -top-1"
        onMouseDown={(event: React.MouseEvent): void =>
          startResizing(event, Direction.NW)
        }
      />
      <div
        // Top-middle resize
        className="handle cursor-n-resize left-1/2 -top-1 -translate-x-1/2"
        onMouseDown={(event: React.MouseEvent): void =>
          startResizing(event, Direction.N)
        }
      />
      <div
        // Top-right resize
        className="handle cursor-ne-resize -right-1 -top-1"
        onMouseDown={(event: React.MouseEvent): void =>
          startResizing(event, Direction.NE)
        }
      />
      <div
        // Left-middle resize
        className="handle cursor-w-resize -left-1 top-1/2 -translate-y-1/2"
        onMouseDown={(event: React.MouseEvent): void =>
          startResizing(event, Direction.W)
        }
      />
      <div
        // Right-middle resize
        className="handle cursor-e-resize -right-1 top-1/2 -translate-y-1/2"
        onMouseDown={(event: React.MouseEvent): void =>
          startResizing(event, Direction.E)
        }
      />
      <div
        // Bottom-left resize
        className="handle -bottom-1 cursor-sw-resize -left-1"
        onMouseDown={(event: React.MouseEvent): void =>
          startResizing(event, Direction.SW)
        }
      />
      <div
        // Bottom-middle resize
        className="handle -bottom-1 cursor-s-resize left-1/2 -translate-x-1/2"
        onMouseDown={(event: React.MouseEvent): void =>
          startResizing(event, Direction.S)
        }
      />
      <div
        // Bottom-right resize
        className="handle -bottom-1 cursor-se-resize -right-1"
        onMouseDown={(event: React.MouseEvent): void =>
          startResizing(event, Direction.SE)
        }
      />
    </div>
  );
}

type DateRangeProps = {
  period: ResumeItemDateRange,
  style: React.CSSProperties
};

const DateRange = ({
  period,
  style
}: DateRangeProps): React.ReactNode => (
  <div style={ style }>
    { formatPeriodText(period) }
  </div>
);

type ResumeElementProps = {
  deleteItem: (item: ResumeItem) => void,
  dragBounds: Ref<HTMLElement>,
  item: ResumeItem,
  updateItem: (item: ResumeItem) => void
};

export default function ResumeElement({
  deleteItem,
  dragBounds,
  item,
  updateItem
}: ResumeElementProps): React.ReactNode {

  const [ dragging, setDragging ] = useState<boolean>(false);
  const [ position, setPosition ] = useState<Coordinates>({
    x: clamp(item.position.x, 0, dragBounds?.current?.clientWidth ?? 0, item.size.width),
    y: clamp(item.position.y, 0, dragBounds?.current?.clientHeight ?? 0, item.size.height),
  });
  const [ boundCorrection, setBoundCorrection ] = useState<Coordinates>(
    DEFAULT_COORDINATES
  );
  const [ size, setSize ] = useState<Dimensions>(item.size);
  const [ , mouseDelta ] = useMousePosition();
  const showContextMenu = useContext<DisplayContextMenuFn>(ContextMenuContext);
  const { editingItem, editItem, hideEditor } = useContext<EditorState>(EditorContext);

  /**
   * Displays a `TextList` as a bullet-point list.
   * 
   * @param list - A `TextList` object.
   * @returns An unordered bullet-point list.
   */
  const displayTextList = (arr: TextList): React.ReactNode => (
    <ul
      className="list-inside -space-y-2"
      style={ getCSSProperties(arr) }
    >
      { arr.text.map((item: string, index: number): React.ReactNode =>
        <li
          className="list-item list-disc"
          key={ index }
        >
          { item }
        </li>
      )}
    </ul>
  );

  /**
   * Returns the CSS Styles for an HTML element.
   * 
   * @param formatting - Object containing properties for styling
   * text.
   * @returns The `CSSProperties` object based on the specified
   * `text` formatting.
   */
  function getCSSProperties(formatting: TextFormatting): React.CSSProperties {
    const UNDERLINE_STYLE: string = formatting.style.includes("U")
      ? "underline "
      : "";
    const STRIKETHROUGH_STYLE: string = formatting.style.includes("S")
      ? "line-through"
      : "";
    return {
      fontFamily: `"${formatting.font}", sans-serif`,
      fontSize: formatting.size,
      fontStyle: formatting.style.includes("I") ? "italic" : "",
      fontWeight: formatting.style.includes("B") ? "bold" : "",
      textAlign: formatting.hAlign,
      textDecoration: UNDERLINE_STYLE + STRIKETHROUGH_STYLE
    };
  }

  // Stop dragging if mousedown released outside of element
  useEventListener("mouseup", (): void => {
    setDragging(false);
    setBoundCorrection(DEFAULT_COORDINATES);
    // Show editor after stopping dragging
    hideEditor(false);
  });

  // Handle dragging element
  useEffect((): void => {
    if (dragging) {
      // Hide editor while dragging element
      hideEditor(true);
      // Update element position
      const X_BOUND: number = dragBounds?.current?.clientWidth ?? 0;
      const Y_BOUND: number = dragBounds?.current?.clientHeight ?? 0;
      setPosition((prevPos: Coordinates): Coordinates => {
        // Correct mouse position to initial drag point when dragging outside of draggable area
        const NEW_X: number = prevPos.x + mouseDelta.x;
        const NEW_Y: number = prevPos.y + mouseDelta.y;
        let correctedXPos: number = boundCorrection.x != 0
          ? prevPos.x
          : NEW_X;
        let correctedYPos: number = boundCorrection.y != 0
          ? prevPos.y
          : NEW_Y;
        setBoundCorrection((prevBC: Coordinates): Coordinates => {
          const NEW_BC_STATE: Coordinates = {
            x: NEW_X < 0 || NEW_X > X_BOUND - size.width || prevBC.x != 0
              ? prevBC.x + mouseDelta.x
              : prevBC.x,
            y: NEW_Y < 0 || NEW_Y > Y_BOUND - size.height || prevBC.y != 0
              ? prevBC.y + mouseDelta.y
              : prevBC.y
          };
          // When mouse returns to draggable area
          if (prevBC.x < 0 && NEW_BC_STATE.x > 0 ||
              prevBC.x > 0 && NEW_BC_STATE.x < 0) {
            correctedXPos += NEW_BC_STATE.x;
            NEW_BC_STATE.x = 0;
          }
          if (prevBC.y < 0 && NEW_BC_STATE.y > 0 ||
              prevBC.y > 0 && NEW_BC_STATE.y < 0) {
            correctedYPos += NEW_BC_STATE.y;
            NEW_BC_STATE.y = 0;
          }
          return NEW_BC_STATE;
        });
        return {
          x: clamp(correctedXPos, 0, X_BOUND, size.width),
          y: clamp(correctedYPos, 0, Y_BOUND, size.height)
        };
      });
    }
  }, [ mouseDelta ]);

  // Update item after moving or resizing
  useEffect((): void => {
    updateItem({
      ...item,
      position: position,
      size: size
    });
  }, [ position, size ]);

  return (
    <div
      className="resume-element text"
      key={ item.id }
      onClick={(event: React.MouseEvent): void => {
        // Do not click on anything else underneath the item
        event.stopPropagation();
        // Show editor when clicking or after dragging item
        editItem(item, updateItem);
      }}
      onContextMenu={(event: React.MouseEvent): void => {
        // Do not display the browser's or any other context menu
        event.preventDefault();
        event.stopPropagation();
        // Display context menu when right-clicking this element
        showContextMenu({
          x: event.pageX,
          y: event.pageY
        }, [
          {
            onPress: (): void => {
              // Hide editor
              editItem(null);
              // Delete item
              deleteItem(item);
            },
            text: "Delete"
          }
        ]);
      }}
      onMouseDown={(): void => {
        // Start dragging item
        setDragging(true);
        editItem(item, updateItem);
      }}
      style={{
        aspectRatio: size.width / size.height,
        height: size.height,
        maxHeight: size.height,
        maxWidth: size.width,
        left: position.x,
        top: position.y,
        width: size.width
      }}
    >
      <ElementHandles
        mouseDelta={ mouseDelta }
        resizeBounds={ dragBounds }
        setPosition={ setPosition }
        setSize={ setSize }
        show={ item.id === editingItem?.id }
        hideEditor={ hideEditor }
      />
      { item.type === RESUME_ITEM_TYPES[0] &&
        // Type: Education
        <div>
          <div style={ getCSSProperties(item.content.institution) }>
            { item.content.institution.text }
          </div>
          <div style={ getCSSProperties(item.content.location) }>
            { item.content.location.text }
          </div>
          <div style={ getCSSProperties(item.content.degree) }>
            { item.content.degree.text }
          </div>
          <div style={ getCSSProperties(item.content.major) }>
            { optionalPrefix("Major: ", item.content.major.text) }
          </div>
          <div style={ getCSSProperties(item.content.minor) }>
            { optionalPrefix("Minor: ", item.content.minor.text) }
          </div>
          <DateRange
            period={ item.content.period }
            style={ getCSSProperties(item.content.period) }
          />
          <div style={ getCSSProperties(item.content.body) }>
            { formatGPAText(item.content.gpa) }
          </div>
          { displayTextList(item.content.body) }
        </div>
      }
      { item.type === RESUME_ITEM_TYPES[1] &&
        // Type: Employment
        <div>
          <div style={ getCSSProperties(item.content.position) }>
            { item.content.position.text }
          </div>
          <div style={ getCSSProperties(item.content.company) }>
            { item.content.company.text }
          </div>
          <div style={ getCSSProperties(item.content.location) }>
            { item.content.location.text }
          </div>
          <DateRange
            period={ item.content.period }
            style={ getCSSProperties(item.content.period) }
          />
          { displayTextList(item.content.body) }
        </div>
      }
      { item.type === RESUME_ITEM_TYPES[2] &&
        // Type: Text
        <div>
          <div style={ getCSSProperties(item.header) }>
            { item.header.text }
          </div>
          { item.content.type === RESUME_ITEM_TEXT_CONTENT_TYPES[0] &&
            // Text body
            <div style={ getCSSProperties(item.content.body) }>
              { item.content.body.text }
            </div>
          }
          { item.content.type === RESUME_ITEM_TEXT_CONTENT_TYPES[1] &&
            // List body
            displayTextList(item.content.body)
          }
          { item.content.type === RESUME_ITEM_TEXT_CONTENT_TYPES[2] &&
            // Tags body
            <div
              className="h-full mt-2 space-x-2 w-full" 
              style={ getCSSProperties(item.content.body) }
            >
              { item.content.body.text.map((listItem: string, index: number): React.ReactNode =>
                <div
                  className="inline-block mb-1.5 outline-1 px-2 rounded-sm"
                  key={ index }
                  style={ getCSSProperties(item.content.body) }
                >
                  { listItem }
                </div>
              )}
            </div>
          }
        </div>
      }
    </div>
  );
}