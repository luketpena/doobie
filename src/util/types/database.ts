import { TaskCycleUnit, TaskListType, TaskRecurrence } from './enums';

export interface Profile {
  id: string;
}

export interface Task {
  id: string;
  created_at: string;
  deleted_at: string;
  start_at: string;
  completed_at?: string | null;
  profile_id: string;
  name: string;
  cycle_interval?: number | null;
  warn_days?: number | null;
  important: boolean;
  recurrence?: TaskRecurrence | null;
  cycle_unit?: TaskCycleUnit | null;
  list_type?: TaskListType | null;
  subtasks?: Subtask[];
}

export interface Subtask {
  id: string;
  created_at: string;
  completed_at?: string | null;
  deleted_at?: string | null;
  name: string;
  task_id: string;
  task?: Task;
}

export interface Database {
  task: Task;
  subtask: Subtask;
}
