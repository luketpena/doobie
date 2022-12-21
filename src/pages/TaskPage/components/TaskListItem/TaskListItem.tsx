import { IonIcon, IonRippleEffect, IonSpinner } from '@ionic/react';
import classNames from 'classnames';
import { checkmarkCircleOutline, ellipseOutline } from 'ionicons/icons';
import { useMemo } from 'react';
import { getDbDate } from '../../../../services/service-utils';
import {
  useMarkCompleteMutation,
  useMarkIncompleteMutation,
} from '../../../../services/task.service';
import { checkTaskComplete } from '../../../../util/task-fns';
import { Task } from '../../../../util/types/database';
import './TaskListItem.scss';

interface TaskListItemProps {
  task: Task;
  date: string;
}

const TaskListItem: React.FC<TaskListItemProps> = ({ task, date }) => {
  const [markComplete, { isLoading: completeLoading }] =
    useMarkCompleteMutation();
  const [markIncomplete, { isLoading: incompleteLoading }] =
    useMarkIncompleteMutation();

  const completed = useMemo(() => {
    return checkTaskComplete(task, date);
  }, [task, date]);

  const isToday = useMemo(() => {
    return getDbDate(date) === getDbDate();
  }, [date]);

  function toggleCompletion() {
    if (!completeLoading && !incompleteLoading && isToday) {
      if (!completed) {
        console.log('Mark complete!');
        markComplete({ taskId: task.id, date });
      } else {
        markIncomplete({ taskId: task.id });
      }
    }
  }

  function renderIcon() {
    if (!isToday) {
      return <div className="task-list-item_icon-spacer"></div>;
    } else if (completeLoading || incompleteLoading) {
      return <IonSpinner name="crescent" />;
    } else {
      return (
        <IonIcon icon={completed ? checkmarkCircleOutline : ellipseOutline} />
      );
    }
  }

  return (
    <div
      className={classNames('task-list-item_container', {
        'task-list-item_complete': completed && isToday,
        'ion-activatable ripple-parent rectangle': isToday,
      })}
      onClick={toggleCompletion}
    >
      {renderIcon()}

      <p>{task.name}</p>
      {isToday && <IonRippleEffect />}
    </div>
  );
};

export default TaskListItem;
