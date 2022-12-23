import { useEffect, useRef } from 'react';

interface LongPressProps {
  action: () => void;
  duration?: number;
  noMovement?: boolean;
}

export const useLongPress = ({
  action,
  duration = 500,
  noMovement = true,
}: LongPressProps) => {
  const listRef = useRef<any>(null);

  useEffect(() => {
    // Setup
    let pressTimeout: any;
    let current: any;

    // Start a listener on down
    const mouseDownAction = () => {
      if (!pressTimeout) {
        pressTimeout = setTimeout(() => {
          action();
          pressTimeout = undefined;
        }, duration);
      }
    };

    // Quick any active listener on up
    const mouseUpAction = () => {
      if (pressTimeout) {
        clearTimeout(pressTimeout);
        pressTimeout = undefined;
      }
    };

    // Reset the timer if movement is detect
    const moveAction = () => {
      if (pressTimeout && noMovement) {
        clearTimeout(pressTimeout);
        pressTimeout = undefined;
        mouseDownAction();
      }
    };

    // Subscribe when a ref is found
    if (listRef && listRef.current) {
      current = listRef.current;
      current.addEventListener('mousedown', mouseDownAction);
      document.addEventListener('mouseup', mouseUpAction);
      document.addEventListener('mousemove', moveAction);
      // current.addEventListener('touchstart', mouseDownAction);
      // current.addEventListener('touchend', mouseUpAction);
      // document.addEventListener('touchmove', moveAction);
    }

    // Unsubscribe listeners
    return () => {
      if (current) {
        current.removeEventListener('mousedown', mouseDownAction);
        document.removeEventListener('mouseup', mouseUpAction);
        document.removeEventListener('mousemove', moveAction);
        // document.removeEventListener('touchmove', moveAction);
        // current.removeEventListener('touchstart', mouseDownAction);
        // current.removeEventListener('touchend', mouseUpAction);
      }
      // Clear any running timeout if active on dismount
      if (pressTimeout) {
        clearTimeout(pressTimeout);
      }
    };
  }, [listRef, duration, action, noMovement]);

  return listRef;
};
