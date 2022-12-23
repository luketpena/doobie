import {
  IonIcon,
  IonRippleEffect,
  IonSpinner,
  useIonActionSheet,
} from '@ionic/react';
import classNames from 'classnames';
import {
  checkmark,
  checkmarkCircleOutline,
  ellipseOutline,
} from 'ionicons/icons';
import { useMemo, useState } from 'react';
import { getDbDate } from '../../../../services/service-utils';
import {
  useMarkCompleteMutation,
  useMarkDeletedMutation,
  useMarkIncompleteMutation,
  useUpdateTaskMutation,
} from '../../../../services/task.service';
import { checkTaskComplete } from '../../../../util/task-fns';
import { Task } from '../../../../util/types/database';
import './TaskListItem.scss';
import { motion } from 'framer-motion';
import { useLongPress } from '../../../../util/gesture-hooks/gesture.long-press';
import { addDays } from 'date-fns';

interface TaskListItemProps {
  task: Task;
  date: string;
}

const TaskListItem: React.FC<TaskListItemProps> = ({ task, date }) => {
  const [present] = useIonActionSheet();

  const pressRef = useLongPress({
    action: presentTaskItemOptions,
  });

  const [markDeleted] = useMarkDeletedMutation();
  const [markComplete, { isLoading: completeLoading }] =
    useMarkCompleteMutation();
  const [markIncomplete, { isLoading: incompleteLoading }] =
    useMarkIncompleteMutation();
  const [updateTask, { isLoading: updateLoading }] = useUpdateTaskMutation();
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(task.name);

  const completed = useMemo(() => {
    return checkTaskComplete(task, date);
  }, [task, date]);

  const isToday = useMemo(() => {
    return getDbDate(date) === getDbDate();
  }, [date]);

  function presentTaskItemOptions() {
    present({
      header: task.name,
      buttons: [
        {
          text: 'Change text',
          handler: () => {
            setEditMode(true);
          },
        },
        {
          text: 'Bump to tomorrow',
          handler: () => {
            updateTask({
              id: task.id,
              start_at: addDays(new Date(), 1).toISOString(),
            });
          },
        },
        {
          text: 'Delete task',
          role: 'destructive',
          handler: () => {
            markDeleted({ taskId: task.id });
          },
        },
      ],
    });
  }

  function toggleCompletion() {
    if (!updateLoading && !editMode) {
      if (!completeLoading && !incompleteLoading && isToday) {
        if (!completed) {
          markComplete({ taskId: task.id, date });
        } else {
          markIncomplete({ taskId: task.id });
        }
      }
    }
  }

  function renderIcon() {
    if (editMode) {
      return <div></div>;
    }

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

  async function submitNameChange() {
    if (!updateLoading) {
      try {
        await updateTask({
          id: task.id,
          name,
        });
        setEditMode(false);
      } catch (error) {
        console.error(error);
      }
    }
  }

  function renderTextInput() {
    return (
      <div className="flex items-center gap-4 w-full">
        <input
          className="form-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="w-8 h-8">
          {!updateLoading ? (
            <IonIcon icon={checkmark} onClick={submitNameChange} />
          ) : (
            <IonSpinner name="crescent" />
          )}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      layout
      ref={pressRef}
      className={classNames('task-list-item_container', {
        'task-list-item_complete': completed && isToday,
        'ion-activatable ripple-parent rectangle': isToday,
      })}
      onClick={toggleCompletion}
    >
      {renderIcon()}

      {!editMode ? <p>{task.name}</p> : renderTextInput()}
      {isToday && !editMode && <IonRippleEffect />}
    </motion.div>
  );
};

export default TaskListItem;
