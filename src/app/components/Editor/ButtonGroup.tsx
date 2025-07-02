import { Button, ButtonGroup as HeroUIButtonGroup, type PressEvent } from "@heroui/react";
import { useEffect, useState } from "react";

type Button = {
  disableRipple?: boolean,
  icon?: React.ReactNode,
  onPress: (event?: PressEvent) => void,
  pressed?: boolean,
  text: string
};

type ButtonProps = {
  isIconOnly?: boolean
};

const ToggleButton = ({
  disableRipple,
  icon,
  isIconOnly,
  onPress,
  pressed,
  text
}: Button & ButtonProps): React.ReactNode => {
  return (
    <Button
      className={(pressed
        ? "bg-gray-500"
        : "bg-gray-400"
      )}
      disableRipple={ disableRipple }
      isIconOnly={ isIconOnly }
      onPress={ onPress }
    >
      { icon }
      { text }
    </Button>
  );
}

type ButtonGroupProps = {
  buttons: Button[],
  canDeselect?: boolean,
  disableRipple?: boolean,
  isDisabled?: boolean,
  isIconOnly?: boolean,
  isRadioGroup?: boolean
};

export default function ButtonGroup({
  buttons,
  canDeselect = true,
  disableRipple,
  isDisabled,
  isIconOnly,
  isRadioGroup
}: ButtonGroupProps): React.ReactNode {

  const [ selectedButtons, setSelectedButtons ] = useState<number[]>([]);

  // Update buttons pressed when group is enabled
  useEffect((): void => {
    if (!isDisabled) {
      let pressedButtons: number[] = [];
      for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].pressed) {
          if (isRadioGroup) {
            // Set first pressed button found as the only pressed button
            setSelectedButtons([ i ]);
            return;
          }
          pressedButtons.push(i);
        }
      }
      setSelectedButtons(pressedButtons);
    }
  }, [ isDisabled ]);

  return (
    <HeroUIButtonGroup
      disableRipple={ disableRipple }
      isDisabled={ isDisabled }
      isIconOnly={ isIconOnly }
    >
      { buttons.map((button: Button, index: number): React.ReactNode =>
        <ToggleButton
          { ...button }
          disableRipple={ disableRipple }
          isIconOnly={ isIconOnly }
          key={ index }
          pressed={ selectedButtons.includes(index) }
          onPress={(): void => {
            // Press/toggle buttons
            if (isRadioGroup) {
              // Radio button
              selectedButtons.includes(index)
                // De-select pressed button
                ? canDeselect && setSelectedButtons([])
                : setSelectedButtons([ index ]);
            } else {
              // Button
              selectedButtons.includes(index)
                ? setSelectedButtons((prevState: number[]): number[] =>
                  prevState.filter((button: number): boolean => button !== index))
                : setSelectedButtons([ ...selectedButtons, index ].toSorted());
            }
            button.onPress();
          }}
        />
      )}
    </HeroUIButtonGroup>
  );
}
