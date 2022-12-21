import {
  IonIcon,
  IonRippleEffect,
  IonSpinner,
  useIonActionSheet,
} from '@ionic/react';
import classNames from 'classnames';
import { checkmarkCircleOutline, ellipseOutline } from 'ionicons/icons';
import { useEffect, useMemo, useRef } from 'react';
import { getDbDate } from '../../../../services/service-utils';
import {
  useMarkCompleteMutation,
  useMarkDeletedMutation,
  useMarkIncompleteMutation,
} from '../../../../services/task.service';
import { checkTaskComplete } from '../../../../util/task-fns';
import { Task } from '../../../../util/types/database';
import './TaskListItem.scss';
import Hammer from 'hammerjs';

interface TaskListItemProps {
  task: Task;
  date: string;
}

const TaskListItem: React.FC<TaskListItemProps> = ({ task, date }) => {
  const [present] = useIonActionSheet();

  const [markDeleted] = useMarkDeletedMutation();
  const [markComplete, { isLoading: completeLoading }] =
    useMarkCompleteMutation();
  const [markIncomplete, { isLoading: incompleteLoading }] =
    useMarkIncompleteMutation();

  const containerRef = useRef<any>(null);

  const completed = useMemo(() => {
    return checkTaskComplete(task, date);
  }, [task, date]);

  const isToday = useMemo(() => {
    return getDbDate(date) === getDbDate();
  }, [date]);

  useEffect(() => {
    let hammerTime: HammerManager;
    if (containerRef.current) {
      hammerTime = new Hammer(containerRef.current);
      hammerTime.on('press', function (e: any) {
        present({
          buttons: [
            {
              text: 'Delete task',
              role: 'destructive',
              handler: () => {
                markDeleted({ taskId: task.id });
              },
            },
          ],
        });
      });
    }
    return () => {
      hammerTime.off('press');
    };
  }, [containerRef, present, task, markDeleted]);

  function toggleCompletion() {
    if (!completeLoading && !incompleteLoading && isToday) {
      if (!completed) {
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
      ref={containerRef}
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
