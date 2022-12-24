import { isPast, isSameDay } from 'date-fns';
import { Task } from './types/database';
import { utcToZonedTime } from 'date-fns-tz';

export function checkTaskComplete(task: Task, date?: string): boolean {
  if (!task.completed_at) {
    return false;
  }
  const completedAt = new Date(task.completed_at);
  const checkDate = utcToZonedTime(
    date ? new Date(date) : new Date(),
    'America/Chicago',
  );

  return isSameDay(completedAt, checkDate) || isPast(completedAt);
}
