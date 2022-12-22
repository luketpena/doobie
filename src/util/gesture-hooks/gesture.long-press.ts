import { useEffect, useRef } from 'react';

interface LongPressProps {
  action: () => void;
  duration?: number;
}

export const useLongPress = ({ action, duration = 250 }: LongPressProps) => {
  const listRef = useRef<any>(null);

  useEffect(() => {
    // Setup
    let pressTimeout: any;
    let current: any;

    // Start a listener on down
    const mouseDownAction = () => {
      pressTimeout = setTimeout(() => {
        action();
      }, duration);
    };

    // Quick any active listener on up
    const mouseUpAction = () => {
      if (pressTimeout) {
        clearTimeout(pressTimeout);
      }
    };

    // Subscribe when a ref is found
    if (listRef && listRef.current) {
      current = listRef.current;
      current.addEventListener('mousedown', mouseDownAction);
      current.addEventListener('mouseup', mouseUpAction);
      current.addEventListener('touchstart', mouseDownAction);
      current.addEventListener('touchend', mouseUpAction);
    }

    // Unsubscribe listeners
    return () => {
      if (current) {
        current.removeEventListener('mousedown', mouseDownAction);
        current.removeEventListener('mouseup', mouseUpAction);
        current.removeEventListener('touchstart', mouseDownAction);
        current.removeEventListener('touchend', mouseUpAction);
      }
      // Clear any running timeout if active on dismount
      if (pressTimeout) {
        clearTimeout(pressTimeout);
      }
    };
  }, [listRef, duration, action]);

  return listRef;
};
