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
  ellipse,
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
import { addDays, isPast as isPastFn, endOfDay } from 'date-fns';

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

  const isPast = useMemo(() => {
    return isPastFn(endOfDay(new Date(date)));
  }, [date]);

  function presentTaskItemOptions() {
    if (!editMode) {
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
  }

  function toggleCompletion() {
    if (!updateLoading && !editMode) {
      if (!completeLoading && !incompleteLoading && !isPast) {
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

    if (isPast) {
      return (
        <div className="w-[28px] h-[28px] flex flex-col justify-center items-center">
          <IonIcon
            icon={completed ? ellipse : ellipseOutline}
            className="text-sm opacity-30"
          />
        </div>
      );
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
      <div className="flex items-center gap-2 w-full">
        <input
          className="task-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={updateLoading}
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
      ref={!editMode ? pressRef : undefined}
      className={classNames({
        'task-list-item_container': !editMode,
        'task-list-item_complete': completed && !isPast,
        'ion-activatable ripple-parent rectangle': !isPast,
        'opacity-30': isPast,
      })}
      onClick={toggleCompletion}
    >
      {renderIcon()}

      {!editMode ? <p>{task.name}</p> : renderTextInput()}
      {!isPast && !editMode && <IonRippleEffect />}
    </motion.div>
  );
};

export default TaskListItem;
