import { useEffect, useRef } from 'react';
import { distanceBetweenPoints } from './gesture-fns';
import { Pos } from './gesture-types';

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
    const startPos: Pos = { x: 0, y: 0 };

    // Start a listener on down
    const downAction = ({ x, y }: Pos) => {
      if (!pressTimeout) {
        startPos.x = x;
        startPos.y = y;
        pressTimeout = setTimeout(() => {
          action();
          pressTimeout = undefined;
        }, duration);
      }
    };

    // Quick any active listener on up
    const upAction = () => {
      if (pressTimeout) {
        clearTimeout(pressTimeout);
        pressTimeout = undefined;
      }
    };

    // Reset the timer if movement is detect
    const moveAction = (pos: Pos) => {
      if (
        pressTimeout &&
        noMovement &&
        distanceBetweenPoints(pos, startPos) > 16
      ) {
        clearTimeout(pressTimeout);
        pressTimeout = undefined;
        downAction(pos);
      }
    };

    // Mouse actions
    const mouseDownAction = (e: MouseEvent) => {
      downAction({
        x: e.screenX,
        y: e.screenY,
      });
    };

    const mouseMoveAction = (e: MouseEvent) => {
      moveAction({
        x: e.screenX,
        y: e.screenY,
      });
    };

    // Touch actions
    const touchDownAction = (e: TouchEvent) => {
      downAction({
        x: e.changedTouches[0].screenX,
        y: e.changedTouches[0].screenY,
      });
    };

    const touchMoveAction = (e: TouchEvent) => {
      moveAction({
        x: e.changedTouches[0].screenX,
        y: e.changedTouches[0].screenY,
      });
    };

    // Subscribe when a ref is found
    if (listRef && listRef.current) {
      current = listRef.current;
      current.addEventListener('mousedown', mouseDownAction);
      document.addEventListener('mouseup', upAction);
      document.addEventListener('mousemove', mouseMoveAction);

      current.addEventListener('touchstart', touchDownAction);
      document.addEventListener('touchend', upAction);
      document.addEventListener('touchmove', touchMoveAction);
    }

    // Unsubscribe listeners
    return () => {
      if (current) {
        current.removeEventListener('mousedown', mouseDownAction);
        document.removeEventListener('mouseup', upAction);
        document.removeEventListener('mousemove', mouseMoveAction);

        current.removeEventListener('touchstart', touchDownAction);
        document.removeEventListener('touchend', upAction);
        document.removeEventListener('touchmove', touchMoveAction);
      }
      // Clear any running timeout if active on dismount
      if (pressTimeout) {
        clearTimeout(pressTimeout);
      }
    };
  }, [listRef, duration, action, noMovement]);

  return listRef;
};
