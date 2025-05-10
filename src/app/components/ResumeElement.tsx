import { useContext, useEffect, useState } from "react";
import useMousePosition from "../hooks/useMousePosition";
import type { Coordinates, Dimensions, Ref, ResumeItem, SetStateFn } from "./Types";
import { DEFAULT_COORDINATES } from "./Types";
import { clamp } from "../utils/NumberUtils";
import useEventListener from "../hooks/useEventListener";
import { ContextMenuContext } from "../contexts/ContextMenuContext";
import "../styles/page.css";
import "../styles/resume-element.css";

type ElementResizeProps = {
  mouseDelta: Coordinates,
  resizeBounds: Ref<HTMLElement>,
  setPosition: SetStateFn<Coordinates>,
  setSize: SetStateFn<Dimensions>,
  show: boolean;
};

function ElementHandles({
  mouseDelta,
  resizeBounds,
  setPosition,
  setSize,
  show = false
}: ElementResizeProps): React.ReactNode {

  enum Direction { NW, N, NE, W, E, SW, S, SE };
  const [ resizing, setResizing ] = useState<boolean>(false);
  const [ resizeDir, setResizeDir ] = useState<Direction>();

  function startResizing(event: React.MouseEvent, direction: Direction): void {
    // Prevent moving element when resizing
    event.preventDefault();
    event.stopPropagation();

    setResizing(true);
    setResizeDir(direction);
  }

  // Stop resizing if mousedown released outside of element
  useEventListener("mouseup", (): void => setResizing(false));

  // Handle resizing element
  useEffect((): void => {
    if (resizing) {
      const X_BOUND: number = resizeBounds.current?.clientWidth ?? 0;
      const Y_BOUND: number = resizeBounds.current?.clientHeight ?? 0;

      setSize((prevSize: Dimensions): Dimensions => {
        let newSize: Dimensions = {
          height: prevSize.height,
          width: prevSize.width
        };
        setPosition((prevPos: Coordinates): Coordinates => {
          let newPos: Coordinates = {
            x: prevPos.x,
            y: prevPos.y
          };
          switch (resizeDir) {
            case Direction.NW:
              newSize.height -= mouseDelta.y;
              newSize.width -= mouseDelta.x;
              newPos.x += mouseDelta.x / 2;
              newPos.y += mouseDelta.y / 2;
              break;
            case Direction.N:
              newSize.height -= mouseDelta.y;
              newPos.y += mouseDelta.y / 2;
              break;
            case Direction.NE:
              newSize.height -= mouseDelta.y;
              newSize.width += mouseDelta.x;
              newPos.y += mouseDelta.y / 2;
              break;
            case Direction.W:
              newSize.width -= mouseDelta.x;
              newPos.x += mouseDelta.x / 2;
              break;
            case Direction.E:
              newSize.width += mouseDelta.x;
              break;
            case Direction.SW:
              newSize.height += mouseDelta.y;
              newSize.width -= mouseDelta.x;
              newPos.x += mouseDelta.x / 2;
              break;
            case Direction.S:
              newSize.height += mouseDelta.y;
              break;
            case Direction.SE:
              newSize.height += mouseDelta.y;
              newSize.width += mouseDelta.x;
          }
          newSize = {
            height: clamp(newSize.height, 1, Y_BOUND, newSize.height),
            width: clamp(newSize.width, 1, X_BOUND, newSize.width)
          };
          return {
            x: clamp(newPos.x, 0, X_BOUND, prevSize.width),
            y: clamp(newPos.y, 0, Y_BOUND, prevSize.height)
          };
        });
        return newSize;
      });
    }
  }, [ mouseDelta ]);

  return (
    <div
      className={ "absolute h-full w-full " + (show
        ? "cursor-move outline-2 visible"
        : "cursor-auto hidden outline-none"
      )}
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

  const [ selected, setSelected ] = useState<boolean>(false);
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
  const showContextMenu = useContext(ContextMenuContext);

  function startDragging(): void {
    setSelected(true);
    setDragging(true);
  }

  function stopDragging(): void {
    setDragging(false);
    setBoundCorrection(DEFAULT_COORDINATES);
  }

  // Stop dragging if mousedown released outside of element
  useEventListener("mouseup", stopDragging);

  // Handle dragging element
  useEffect((): void => {
    if (dragging) {
      const X_BOUND: number = dragBounds?.current?.clientWidth ?? 0;
      const Y_BOUND: number = dragBounds?.current?.clientHeight ?? 0;
      
      // Update element position
      setPosition((prevPos: Coordinates): Coordinates => {
        const NEW_X: number = prevPos.x + mouseDelta.x;
        const NEW_Y: number = prevPos.y + mouseDelta.y;
        let correctedXPos = boundCorrection.x != 0
          ? prevPos.x
          : NEW_X;
        let correctedYPos = boundCorrection.y != 0
          ? prevPos.y
          : NEW_Y;

        // Correct mouse position to initial drag point when dragging outside of draggable area
        setBoundCorrection((prevBC: Coordinates): Coordinates => {
          let newBCState: Coordinates = {
            x: NEW_X < 0 || NEW_X > X_BOUND - size.width || prevBC.x != 0
              ? prevBC.x + mouseDelta.x
              : prevBC.x,
            y: NEW_Y < 0 || NEW_Y > Y_BOUND - size.height || prevBC.y != 0
              ? prevBC.y + mouseDelta.y
              : prevBC.y
          }
          // When mouse returns to draggable area
          if (prevBC.x < 0 && newBCState.x > 0 ||
            prevBC.x > 0 && newBCState.x < 0) {
            correctedXPos += newBCState.x;
            newBCState.x = 0;
          }
          if (prevBC.y < 0 && newBCState.y > 0 ||
              prevBC.y > 0 && newBCState.y < 0) {
            correctedYPos += newBCState.y;
            newBCState.y = 0;
          }
          
          return newBCState;
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
      id: item.id,
      position: position,
      size: size,
      type: item.type
    });
  }, [ position, size ]);

  return (
    <div
      className="absolute"
      onContextMenu={(event: React.MouseEvent): void => {
        // Do not display the browser's or any other context menu
        event.preventDefault();
        event.stopPropagation();

        showContextMenu({
          x: event.pageX,
          y: event.pageY
        }, [
          {
            onPress: (): void => deleteItem(item),
            text: "Delete"
          }
        ]);
      }}
      onMouseDown={ startDragging }
      style={{
        aspectRatio: size.width / size.height,
        height: size.height,
        maxHeight: size.height,
        maxWidth: size.width,
        left: position.x,
        outline: (selected)
          ? "0px"
          : "1px solid #aaa",
        top: position.y,
        width: size.width
      }}
    >
      <ElementHandles
        mouseDelta={ mouseDelta }
        resizeBounds={ dragBounds }
        setPosition={ setPosition }
        setSize={ setSize }
        show={ selected }
      />
    </div>
  );
}