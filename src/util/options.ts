import { TaskCycleUnit, TaskListType, TaskRecurrence } from './types/enums';

export interface FormItemSelectorOption<T = string> {
  label: string;
  value: T | null;
  selectionText: string;
}

export const taskRecurrenceOptions: FormItemSelectorOption<TaskRecurrence>[] = [
  {
    value: TaskRecurrence.Single,
    label: 'Single',
    selectionText: 'and it will happen *once',
  },
  {
    value: TaskRecurrence.Daily,
    label: 'Daily',
    selectionText: 'and it will happen *daily',
  },
  {
    value: TaskRecurrence.Weekly,
    label: 'Weekly',
    selectionText: 'and it will happen on that *day of the week every week',
  },
  {
    value: TaskRecurrence.Monthly,
    label: 'Monthly',
    selectionText: 'and it will happen on that date *every month',
  },
  {
    value: TaskRecurrence.Yearly,
    label: 'Yearly',
    selectionText: 'and it will happen on that date *every year',
  },
  {
    value: TaskRecurrence.Cycle,
    label: 'Cycle',
    selectionText: 'and will happen *on a cycle',
  },
];

export const taskCycleUnitOptions: FormItemSelectorOption<TaskCycleUnit>[] = [
  {
    value: TaskCycleUnit.Day,
    label: 'Days',
    selectionText: 'days',
  },
  {
    value: TaskCycleUnit.Week,
    label: 'Weeks',
    selectionText: 'weeks',
  },
  {
    value: TaskCycleUnit.Month,
    label: 'Months',
    selectionText: 'months',
  },
];

export const taskListOptions: FormItemSelectorOption<TaskListType>[] = [
  {
    value: TaskListType.Checklist,
    label: 'Checklist',
    selectionText: 'it is a *checklist* of subtasks to complete',
  },
  {
    value: TaskListType.Random,
    label: 'Random list',
    selectionText: 'it is a task *randomly selected from a list of subtasks*',
  },
  {
    value: TaskListType.Rotating,
    label: 'Rotating list',
    selectionText: 'it is a *rotating list of tasks*',
  },
  {
    value: null,
    label: 'Single',
    selectionText: 'it is a *single task',
  },
];
