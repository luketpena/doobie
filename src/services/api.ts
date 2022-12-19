import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiTags = {
  tasks: 'tasks',
  subtasks: 'subtasks',
  recurringTasks: 'recurring-tasks',
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fakeBaseQuery(),
  tagTypes: Object.values(apiTags),
  endpoints: (build) => ({}),
});
