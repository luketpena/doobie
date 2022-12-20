import { IonButton, IonFab, IonFabButton, IonIcon } from '@ionic/react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { addDays, format, parseISO } from 'date-fns';
import {
  add,
  chevronBackCircleOutline,
  chevronForwardCircleOutline,
} from 'ionicons/icons';
import React, { useMemo, useRef, useState } from 'react';
import ToDoForm from '../../components/ToDoForm/ToDoForm';
import { selectProfile } from '../../redux/authentication-slice';
import { useAppSelector } from '../../redux/store';
import { getDbDate } from '../../services/service-utils';
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

  const { data: dailyTasks } = useGetTasksForDateQuery(
    profile ? { profileId: profile.id, date } : skipToken,
  );
  const { data: recurringTasks } = useGetRecurringTasksQuery(
    profile ? { profileId: profile.id, date } : skipToken,
  );

  const isToday: boolean = useMemo(() => {
    return isTodayFn(new Date(date));
  }, [date]);

  const tasks = useMemo(() => {
    // ...(dailyTasks ?? []),
    return [...(recurringTasks ?? []), ...(dailyTasks ?? [])];
  }, [dailyTasks, recurringTasks]);

  function incrementDate(change: number) {
    setDate(addDays(parseISO(date), change).toISOString());
  }

  return (
    <div ref={container}>
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
      <QuickAddTask />
      <TaskList tasks={tasks} date={date} />
      <IonFab slot="fixed" horizontal="end" vertical="bottom">
        <IonFabButton onClick={() => setOpen(true)}>
          <IonIcon icon={add}></IonIcon>
        </IonFabButton>
      </IonFab>
      <ToDoForm open={open} setOpen={setOpen} />
    </div>
  );
};

export { ToDoPage };
