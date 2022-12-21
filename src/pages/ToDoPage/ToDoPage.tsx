import { IonButton, IonFab, IonFabButton, IonIcon } from '@ionic/react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { addDays, format, parseISO } from 'date-fns';
import {
  add,
  chevronBackCircleOutline,
  chevronForwardCircleOutline,
} from 'ionicons/icons';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import ToDoForm from '../../components/ToDoForm/ToDoForm';
import { selectProfile } from '../../redux/authentication-slice';
import { useAppSelector } from '../../redux/store';
import {
  useGetRecurringTasksQuery,
  useGetTasksForDateQuery,
} from '../../services/task.service';
import TaskList from './components/TaskList/TaskList';
import './TaskPage.scss';
import { isToday as isTodayFn } from 'date-fns';
import QuickAddTask from '../../components/QuickAddTask/QuickAddTask';

const ToDoPage: React.FC = () => {
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

  const isToday: boolean = useMemo(() => {
    return isTodayFn(new Date(date));
  }, [date]);

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
        <div className="task-page_date-container">
          <IonButton onClick={() => incrementDate(-1)}>
            <IonIcon icon={chevronBackCircleOutline} />
          </IonButton>
          <div className="task-page_date-display">
            <div className="day-of-week">
              {isToday ? 'Today' : format(new Date(date), 'EEEE')}
            </div>
            <div>{format(new Date(date), 'MMMM do, yyyy')}</div>
          </div>
          <IonButton onClick={() => incrementDate(1)}>
            <IonIcon icon={chevronForwardCircleOutline} />
          </IonButton>
        </div>

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
      <ToDoForm open={open} setOpen={setOpen} />
    </>
  );
};

export { ToDoPage };
