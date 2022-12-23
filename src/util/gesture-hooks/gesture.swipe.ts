import { differenceInMilliseconds } from 'date-fns';
import { useEffect, useRef } from 'react';
import { distanceBetweenPoints } from './gesture-fns';
import { Pos } from './gesture-types';

interface SwipeProps {
  actionHorizontal?: (v: 1 | -1) => void;
  actionVertical?: (v: 1 | -1) => void;
}

export const useSwipe = ({ actionHorizontal, actionVertical }: SwipeProps) => {
  const listRef = useRef<any>(null);
  const duration = 500;
  const minDistance = 100;

  useEffect(() => {
    /**
     * .timestamp
     *
     * mouse: .x and .y
     * touch: .changedTouches[0].clientX / clientY
     */
    // Setup
    let current: any;
    const posStart: Pos = { x: 0, y: 0 };
    let timeStart: Date;

    // Basic functions
    const downAction = ({
      startX,
      startY,
    }: {
      startX: number;
      startY: number;
    }) => {
      posStart.x = startX;
      posStart.y = startY;
      timeStart = new Date();
    };

    const upAction = (pos: Pos) => {
      const { x, y } = pos;
      const msElapsed = differenceInMilliseconds(new Date(), timeStart);
      const distance = distanceBetweenPoints(pos, posStart);

      const pixelsPerMs = distance / msElapsed;

      if (pixelsPerMs > 0.8) {
        if (distance > minDistance) {
          if (Math.abs(posStart.x - x) > Math.abs(posStart.y - y)) {
            if (actionHorizontal) {
              actionHorizontal(posStart.x > x ? -1 : 1);
            }
          } else {
            if (actionVertical) {
              actionVertical(posStart.y > y ? -1 : 1);
            }
          }
        }
      }
    };

    // Mouse functions
    const mouseDownAction = (e: MouseEvent) => {
      downAction({
        startX: e.screenX,
        startY: e.screenY,
      });
    };

    const mouseUpAction = (e: MouseEvent) => {
      upAction({ x: e.screenX, y: e.screenY });
    };

    // Touch functions
    const touchDownAction = (e: TouchEvent) => {
      downAction({
        startX: e.changedTouches[0].screenX,
        startY: e.changedTouches[0].screenY,
      });
    };

    const touchUpAction = (e: TouchEvent) => {
      upAction({
        x: e.changedTouches[0].screenX,
        y: e.changedTouches[0].screenY,
      });
    };

    // Subscribe when a ref is found
    if (listRef && listRef.current) {
      current = listRef.current;
      current.addEventListener('mousedown', mouseDownAction);
      document.addEventListener('mouseup', mouseUpAction);
      current.addEventListener('touchstart', touchDownAction);
      document.addEventListener('touchend', touchUpAction);
    }

    // Unsubscribe listeners
    return () => {
      if (current) {
        current.removeEventListener('mousedown', mouseDownAction);
        document.removeEventListener('mouseup', mouseUpAction);
        current.removeEventListener('touchstart', touchDownAction);
        document.removeEventListener('touchend', touchUpAction);
      }
    };
  }, [listRef, actionHorizontal, actionVertical]);

  return listRef;
};
