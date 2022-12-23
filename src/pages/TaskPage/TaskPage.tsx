import { IonFab, IonFabButton, IonIcon } from '@ionic/react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { addDays, parseISO } from 'date-fns';
import { add } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';
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
import { Task } from '../../util/types/database';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipe } from '../../util/gesture-hooks/gesture.swipe';

const TaskPage: React.FC = () => {
  const container = useSwipe({
    actionHorizontal: (dir) => {
      incrementDate(-dir);
    },
  });
  const profile = useAppSelector(selectProfile);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date().toISOString());
  const [loading, setLoading] = useState(true);

  const { data: dailyTasks, isLoading: dailyLoading } = useGetTasksForDateQuery(
    profile ? { profileId: profile.id, date } : skipToken,
  );
  const { data: recurringTasks, isLoading: recurringLoading } =
    useGetRecurringTasksQuery(
      profile ? { profileId: profile.id, date } : skipToken,
    );

  const [tasks, setTasks] = useState<Task[]>([]);

  // Combines recurring tasks for today and all daily tasks
  useEffect(() => {
    if (!dailyLoading && !recurringLoading) {
      setTasks([...(recurringTasks ?? []), ...(dailyTasks ?? [])]);
      setLoading(false);
    }
  }, [dailyTasks, recurringTasks, dailyLoading, recurringLoading]);

  function incrementDate(change: number) {
    setDate(addDays(parseISO(date), change).toISOString());
    setTasks([]);
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
      <AnimatePresence>
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
          <motion.div layout className="w-full h-full relative">
            <div className="w-full h-full overflow-y-scroll overflow-x-hidden left-0 top-0 absolute">
              <TaskList tasks={tasks} date={date} loading={loading} />
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
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
