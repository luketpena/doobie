import { Pos } from './gesture-types';

export function distanceBetweenPoints(pos1: Pos, pos2: Pos) {
  const x = Math.pow(pos1.x - pos2.x, 2);
  const y = Math.pow(pos2.y - pos2.y, 2);
  return Math.sqrt(x + y);
}
