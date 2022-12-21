import { endOfDay, startOfDay } from 'date-fns';
import { TaskFormValues } from '../components/TaskForm/TaskForm';
import { supabase } from '../supabase-client';
import { filterRecurringTasks } from '../util/recurrence-fns';
import { Task } from '../util/types/database';
import { TaskRecurrence } from '../util/types/enums';
import { api, apiTags } from './api';
import {
  handleSupabaseError,
  processSupabaseData,
  processSupabaseDataArray,
} from './service-utils';

const taskService = api.injectEndpoints({
  endpoints: (build) => ({
    // -- POST --
    createTask: build.mutation<Task, TaskFormValues>({
      queryFn: async (payload) => {
        if (!payload.name) {
          throw new Error('Task must have a name');
        }

        const data = await supabase
          .from('task')
          .insert({
            ...payload,
            subtasks:
              payload.subtasks && payload.subtasks.length > 0
                ? payload.subtasks
                : null,
          })
          .select('*')
          .limit(1)
          .then(handleSupabaseError);

        return { data };
      },
      invalidatesTags: [apiTags.tasks, apiTags.recurringTasks],
    }),

    quickCreateTask: build.mutation<
      Task,
      { name: string; profile_id: string; date: Date | string }
    >({
      queryFn: async ({ name, profile_id, date }) => {
        if (!name) {
          throw new Error('Task must have a name');
        }

        const payload: TaskFormValues = {
          name,
          start_at: new Date(date),
          important: false,
          recurrence: TaskRecurrence.Single,
          cycle_unit: null,
          cycle_interval: null,
          list_type: null,
          warn_days: 0,
          subtasks: [],
        };

        const data = await supabase
          .from('task')
          .insert({
            ...payload,
            profile_id,
          })
          .select('*')
          .limit(1)
          .then(handleSupabaseError);

        return { data };
      },
      invalidatesTags: [apiTags.tasks],
    }),

    // -- GET --
    getTasksForDate: build.query<Task[], { profileId: string; date: string }>({
      queryFn: async ({ profileId, date }) => {
        const start_at = new Date(date);
        const data = await supabase
          .from('task')
          .select('*')
          .match({
            profile_id: profileId,
            recurrence: TaskRecurrence.Single,
          })
          .is('deleted_at', null)
          .gte('start_at', startOfDay(start_at).toISOString())
          .lt('start_at', endOfDay(start_at).toISOString())
          .order('created_at', { ascending: false })
          .then(processSupabaseDataArray);
        return { data };
      },
      providesTags: [apiTags.tasks],
    }),

    getRecurringTasks: build.query<Task[], { profileId: string; date: string }>(
      {
        queryFn: async ({ profileId, date }) => {
          const unfilteredTasks = await supabase
            .from('task')
            .select('*')
            .eq('profile_id', profileId)
            .is('deleted_at', null)
            .neq('recurrence', TaskRecurrence.Single)
            .then(processSupabaseDataArray);

          const data = filterRecurringTasks(unfilteredTasks, date);

          return { data };
        },
        providesTags: [apiTags.recurringTasks],
      },
    ),

    // -- PUT --
    markComplete: build.mutation<Task, { taskId: string; date: string }>({
      queryFn: async ({ taskId, date }) => {
        const data = await supabase
          .from('task')
          .update({
            completed_at: new Date(),
          })
          .eq('id', taskId)
          .select('*')
          .then(processSupabaseData);

        return { data };
      },
      invalidatesTags: [apiTags.tasks, apiTags.recurringTasks],
    }),

    markIncomplete: build.mutation<Task, { taskId: string }>({
      queryFn: async ({ taskId }) => {
        const data = await supabase
          .from('task')
          .update({
            completed_at: null,
          })
          .eq('id', taskId)
          .select('*')
          .then(processSupabaseData);

        return { data };
      },
      invalidatesTags: [apiTags.tasks, apiTags.recurringTasks],
    }),

    markDeleted: build.mutation<Task, { taskId: string }>({
      queryFn: async ({ taskId }) => {
        const data = await supabase
          .from('task')
          .update({
            deleted_at: new Date(),
          })
          .eq('id', taskId)
          .select('*')
          .then(processSupabaseData);

        return { data };
      },
      invalidatesTags: [apiTags.tasks, apiTags.recurringTasks],
    }),
  }),
});

export const {
  useCreateTaskMutation,
  useQuickCreateTaskMutation,
  useGetTasksForDateQuery,
  useGetRecurringTasksQuery,
  useMarkCompleteMutation,
  useMarkIncompleteMutation,
  useMarkDeletedMutation,
} = taskService;
