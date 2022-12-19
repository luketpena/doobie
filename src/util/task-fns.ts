import { getDbDate } from '../services/service-utils';
import { Task } from './types/database';

export function checkTaskComplete(task: Task, date?: string) {
  const result = task.completed_at === getDbDate(date);
  return result;
}
