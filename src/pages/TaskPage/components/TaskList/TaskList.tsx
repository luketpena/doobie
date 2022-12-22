import { IonSpinner } from '@ionic/react';
import { Task } from '../../../../util/types/database';
import TaskListItem from '../TaskListItem/TaskListItem';
import { useMemo, useState } from 'react';
import { isAfter } from 'date-fns';
import { motion } from 'framer-motion';

interface TaskListProps {
  tasks: Task[] | undefined;
  date: string;
  loading: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, date, loading }) => {
  const [lastDate, setLastDate] = useState<Date>(new Date(date));

  const direction = useMemo(() => {
    const newDate = new Date(date);

    const result = isAfter(lastDate, newDate) ? 1 : -1;
    setLastDate(newDate);

    return result;
  }, [date]);

  const variants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: `${-100 * direction}%` },
  };

  function renderTaskListItems() {
    if (loading) {
      return (
        <div className="flex justify-center w-full">
          <IonSpinner name="crescent" />
        </div>
      );
    }
    if (!tasks || tasks.length === 0) {
      return (
        <div className="flex justify-center w-full">
          <p>No tasks to show</p>
        </div>
      );
    }
    return (
      <motion.div
        initial="closed"
        animate="open"
        variants={variants}
        className="flex flex-col overflow-x-hidden pb-16 pr-4"
      >
        {tasks.map((task, i) => (
          <TaskListItem
            key={`task-list-item-${task.id}-${date}`}
            task={task}
            date={date}
            direction={direction}
          />
        ))}
      </motion.div>
    );
  }

  return <>{renderTaskListItems()}</>;
};

export default TaskList;
