import { ToDoFormValues } from '../components/ToDoForm/ToDoForm';
import { supabase } from '../supabase-client';
import { filterRecurringTasks } from '../util/recurrence-fns';
import { Task } from '../util/types/database';
import { TaskRecurrence } from '../util/types/enums';
import { api, apiTags } from './api';
import {
  getDbDate,
  handleSupabaseError,
  processSupabaseData,
  processSupabaseDataArray,
} from './service-utils';

const taskService = api.injectEndpoints({
  endpoints: (build) => ({
    // -- POST --
    createTask: build.mutation<Task, ToDoFormValues>({
      queryFn: async (payload) => {
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

    // -- GET --
    getTasksForDate: build.query<Task[], { profileId: string; date: string }>({
      queryFn: async ({ profileId, date }) => {
        const data = await supabase
          .from('task')
          .select('*')
          .match({
            profile_id: profileId,
            start_at: getDbDate(date),
            recurrence: TaskRecurrence.Single,
          })
          .order('id')
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
            completed_at: getDbDate(date),
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
  }),
});

export const {
  useCreateTaskMutation,
  useGetTasksForDateQuery,
  useGetRecurringTasksQuery,
  useMarkCompleteMutation,
  useMarkIncompleteMutation,
} = taskService;
