import { IonFab, IonFabButton, IonIcon } from '@ionic/react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { addDays, parseISO } from 'date-fns';
import { add } from 'ionicons/icons';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import TaskForm from '../../components/TaskForm/TaskForm';
import { selectProfile } from '../../redux/authentication-slice';
import { useAppSelector } from '../../redux/store';
import {
  useGetRecurringTasksQuery,
  useGetTasksForDateQuery,
} from '../../services/task.service';
import TaskList from './components/TaskList/TaskList';
import './TaskPage.scss';

import QuickAddTask from '../../components/QuickAddTask/QuickAddTask';
import DateNavigator from './components/DateNavigator/DateNavigator';

const TaskPage: React.FC = () => {
  const container = useRef<any>(null);
  const profile = useAppSelector(selectProfile);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date().toISOString());
  const [loading, setLoading] = useState(true);

  const { data: dailyTasks } = useGetTasksForDateQuery(
    profile ? { profileId: profile.id, date } : skipToken,
  );
  const { data: recurringTasks } = useGetRecurringTasksQuery(
    profile ? { profileId: profile.id, date } : skipToken,
  );

  // NOTE: isLoading does not reset for these ongoing queries, we respond to data received instead
  useEffect(() => {
    setLoading(false);
  }, [dailyTasks, recurringTasks]);

  // Combines recurring tasks for today and all daily tasks
  const tasks = useMemo(() => {
    return [...(recurringTasks ?? []), ...(dailyTasks ?? [])];
  }, [dailyTasks, recurringTasks]);

  function incrementDate(change: number) {
    setDate(addDays(parseISO(date), change).toISOString());
    setLoading(true);
  }

  function navigateDateByKey(event: React.KeyboardEvent<HTMLDivElement>) {
    switch (event.key) {
      case 'ArrowRight':
        incrementDate(1);
        break;
      case 'ArrowLeft':
        incrementDate(-1);
        break;
    }
  }

  return (
    <>
      <div
        ref={container}
        className="task-page_container"
        tabIndex={0}
        onKeyDown={(event) => navigateDateByKey(event)}
      >
        {/* Date control */}
        <DateNavigator
          date={date}
          incrementDate={incrementDate}
          setDate={setDate}
        />

        {/* Quick add */}
        <QuickAddTask date={date} />

        {/* Task list */}
        <div className="task-age_list-wrapper">
          <div className="task-page_list-content">
            <TaskList tasks={tasks} date={date} loading={loading} />
          </div>
        </div>
      </div>
      <IonFab slot="fixed" horizontal="end" vertical="bottom">
        <IonFabButton onClick={() => setOpen(true)}>
          <IonIcon icon={add}></IonIcon>
        </IonFabButton>
      </IonFab>
      <TaskForm open={open} setOpen={setOpen} />
    </>
  );
};

export { TaskPage as ToDoPage };
