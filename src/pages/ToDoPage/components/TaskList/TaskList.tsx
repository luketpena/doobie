import { Task } from '../../../../util/types/database';
import TaskListItem from '../TaskListItem/TaskListItem';
import './TaskList.scss';

interface TaskListProps {
  tasks: Task[] | undefined;
  date: string;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, date }) => {
  function renderTaskListItems() {
    if (!tasks || tasks.length === 0) {
      // TODO: Render "no tasks" notification
      return;
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
