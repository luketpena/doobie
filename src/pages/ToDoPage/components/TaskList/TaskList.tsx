import { IonSpinner } from '@ionic/react';
import { Task } from '../../../../util/types/database';
import TaskListItem from '../TaskListItem/TaskListItem';
import './TaskList.scss';

interface TaskListProps {
  tasks: Task[] | undefined;
  date: string;
  loading: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, date, loading }) => {
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
      <div className="task-list_list">
        {tasks.map((task, i) => (
          <TaskListItem
            key={`task-list-item-${task.id}-${date}`}
            task={task}
            date={date}
          />
        ))}
      </div>
    );
  }

  return <>{renderTaskListItems()}</>;
};

export default TaskList;
