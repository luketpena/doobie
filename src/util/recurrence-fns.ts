import { getDay, startOfDay } from 'date-fns';
import { translateDbDate } from '../services/service-utils';
import { Task } from './types/database';
import { TaskRecurrence } from './types/enums';

export function filterRecurringTasks(tasks: Task[], inputDate: string) {
  const date = startOfDay(new Date(inputDate));

  return tasks.filter((task) => {
    const taskStartDate = startOfDay(translateDbDate(task.start_at));

    switch (task.recurrence) {
      case TaskRecurrence.Daily:
        return true;

      case TaskRecurrence.Weekly:
        return getDay(date) === getDay(taskStartDate);
    }

    return false;
  });
}
