import { useEffect, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import type { Coordinates, Ref } from "../components/Types";
import { DEFAULT_COORDINATES } from "../components/Types";

export default function useMousePosition(boundaryRef?: Ref<HTMLElement>): [ Coordinates, Coordinates ] {

  const [ mousePos, setMousePos ] = useState<Coordinates>(DEFAULT_COORDINATES);
  const [ movementDelta, setMovementDelta ] = useState<Coordinates>(DEFAULT_COORDINATES);
  const { scrollX, scrollY } = useScroll();

  // Add mouse movement from page scrolling to delta
  useMotionValueEvent(scrollY, "change", () => {
    setMovementDelta({
      x: scrollX.get() - (scrollX.getPrevious() ?? 0),
      y: scrollY.get() - (scrollY.getPrevious() ?? 0)
    });
  });

  // Mouse position and movement
  useEffect((): (() => void) => {
    const handleMouseMovement = (event: MouseEvent): void => {
      setMousePos({
        x: event.clientX,
        y: event.clientY
      });
      setMovementDelta({
        x: event.movementX,
        y: event.movementY
      });
    }

    (boundaryRef?.current)
      // Only return mouse position while it is hovering over the specified element
      ? boundaryRef.current.addEventListener("mousemove", handleMouseMovement)
      : addEventListener("mousemove", handleMouseMovement);

    // Cleanup
    return (): void => (boundaryRef?.current)
      ? boundaryRef.current.removeEventListener("mousemove", handleMouseMovement)
      : removeEventListener("mousemove", handleMouseMovement);
  }, [ boundaryRef ]);

  return [ mousePos, movementDelta ];
}