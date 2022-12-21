import {
  IonButton,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonModal,
} from '@ionic/react';
import { add, remove } from 'ionicons/icons';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { taskListOptions } from '../../../../util/options';
import { TaskListType } from '../../../../util/types/enums';
import ModalHeader from '../../../ModalHeader/ModalHeader';
import { TaskFormValues } from '../../TaskForm';
import FormItem from '../../../_form/FormItem/FormItem';
import FormItemSelector, {
  valueToItemText,
} from '../../../_form/FormItemSelector/FormItemSelector';
import './TaskFormSubtaskInput.scss';

const TaskFormSubtaskInput: React.FC = () => {
  const form = useFormContext<TaskFormValues>();
  const { control, watch, getValues, setValue } = form;

  const [open, setOpen] = useState(false);
  const [listType, setListType] = useState<TaskListType | null>(null);
  const [subtasks, setSubtasks] = useState<string[]>([]);

  const buttonText = useMemo<string>(() => {
    let string = valueToItemText(listType as string, taskListOptions);

    if (subtasks && subtasks.length > 0) {
      let subtasksCopy = [...subtasks];
      if (subtasks.length > 1) {
        const lastItemText = subtasksCopy[subtasks.length - 1];
        subtasksCopy[subtasks.length - 1] = `*and *${lastItemText}`;
      }
      let subtaskString = `*${subtasksCopy.join(', ')}`;
      string = `${string} containing ${subtaskString}`;
    }

    return string;
  }, [listType, subtasks]);

  useEffect(() => {
    const values = getValues();
    setListType(values.list_type);

    const watchSub = watch((value, { name }) => {
      if (name === 'list_type' && value.list_type !== undefined) {
        setListType(value.list_type);
        // Create initial subtask when first setting to a list type
        if (!value.subtasks || value.subtasks.length === 0) {
          setValue('subtasks', ['']);
        }
      }
    });

    return () => {
      watchSub.unsubscribe();
    };
  }, [watch, getValues, setValue]);

  function onClose() {
    const values = getValues();
    let subtasksCopy = [...values.subtasks].filter((subtask) => !!subtask);
    if (!values.subtasks || subtasksCopy.length === 0) {
      setValue('list_type', null);
      setSubtasks([]);
    }
    setValue('subtasks', subtasksCopy);
    setSubtasks(subtasksCopy);
    setOpen(false);
  }

  return (
    <>
      <FormItem text={buttonText} onClick={() => setOpen(true)} />
      <IonModal isOpen={open}>
        <ModalHeader title="Schedule task" onClose={onClose} />
        <IonContent>
          <FormItemSelector
            options={taskListOptions}
            control={control}
            name="list_type"
          />
          {listType !== null && (
            <Controller
              control={control}
              name="subtasks"
              render={({ field }) => {
                return (
                  <div className="flex flex-col gap2">
                    {field.value.map((subtask, i) => {
                      return (
                        <div
                          key={`subtask-input-${i}`}
                          className="to-do-form-subtask-input_input-row"
                        >
                          <IonButton
                            className="m-0 h-full"
                            onClick={() => {
                              const value = [...field.value];
                              value.splice(i, 1);
                              field.onChange(value);
                            }}
                          >
                            <IonIcon icon={remove} />
                          </IonButton>

                          <input
                            className="form-input"
                            type="text"
                            placeholder={`Subtask ${i + 1}`}
                            value={subtask}
                            onChange={(e: any) => {
                              const value = [...field.value];
                              value[i] = e.target.value;
                              field.onChange(value);
                            }}
                          />
                        </div>
                      );
                    })}
                    <div className="flex justify-center p-4">
                      <IonFab>
                        <IonFabButton
                          onClick={() => {
                            field.onChange([...field.value, '']);
                          }}
                        >
                          <IonIcon icon={add} />
                        </IonFabButton>
                      </IonFab>
                    </div>
                  </div>
                );
              }}
            />
          )}
        </IonContent>
      </IonModal>
    </>
  );
};

export default TaskFormSubtaskInput;
