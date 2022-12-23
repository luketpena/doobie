import { differenceInMilliseconds } from 'date-fns';
import { useEffect, useRef } from 'react';

interface SwipeProps {
  actionHorizontal?: (v: 1 | -1) => void;
  actionVertical?: (v: 1 | -1) => void;
}

export const useSwipe = ({ actionHorizontal, actionVertical }: SwipeProps) => {
  const listRef = useRef<any>(null);
  const duration = 500;
  const minDistance = 200;

  useEffect(() => {
    /**
     * .timestamp
     *
     * mouse: .x and .y
     * touch: .changedTouches[0].clientX / clientY
     */
    // Setup
    let current: any;
    const posStart = { x: 0, y: 0 };
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

    const upAction = ({ endX, endY }: { endX: number; endY: number }) => {
      const msElapsed = differenceInMilliseconds(timeStart, new Date());
      if (msElapsed < duration) {
        const xx = Math.pow(endX - posStart.x, 2);
        const yy = Math.pow(endY - posStart.y, 2);
        const distance = Math.sqrt(xx + yy);
        if (distance > minDistance) {
          if (Math.abs(posStart.x - endX) > Math.abs(posStart.y - endY)) {
            if (actionHorizontal) {
              actionHorizontal(posStart.x > endX ? -1 : 1);
            }
          } else {
            if (actionVertical) {
              actionVertical(posStart.y > endY ? -1 : 1);
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
      upAction({ endX: e.screenX, endY: e.screenY });
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
        endX: e.changedTouches[0].screenX,
        endY: e.changedTouches[0].screenY,
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
