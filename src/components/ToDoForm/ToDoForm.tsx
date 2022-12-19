import { IonButton, IonContent, IonFooter, IonModal } from '@ionic/react';
import ToDoFormImportanceInput from '../_form/to-do-form/ToDoFormImportanceInput/ToDoFormImportanceInput';
import { FormProvider, useForm } from 'react-hook-form';
import FormInput from '../_form/FormInput/FormInput';
import ToDoFormScheduleInput from '../_form/to-do-form/ToDoFormScheduleInput/ToDoFormScheduleInput';
import ModalHeader from '../ModalHeader/ModalHeader';
import {
  TaskCycleUnit,
  TaskListType,
  TaskRecurrence,
} from '../../util/types/enums';
import ToDoFormSubtaskInput from '../_form/to-do-form/ToDoFormSubtaskInput/ToDoFormSubtaskInput';
import FormIncrementor from '../_form/FormIncrementor/FormIncrementor';
import { rules } from '../../util/rules';
import './ToDoForm.scss';
import { useCreateTaskMutation } from '../../services/task.service';
import { useAppSelector } from '../../redux/store';
import { selectProfile } from '../../redux/authentication-slice';
import { useEffect } from 'react';

interface ToDoFormProps {
  open: boolean;
  setOpen: (v: boolean) => void;
}

export interface ToDoFormValues {
  name: string;
  important: boolean;
  start_at: Date;
  recurrence: TaskRecurrence;
  cycle_unit: TaskCycleUnit | null;
  cycle_interval: number | null;
  list_type: TaskListType | null;
  subtasks: string[];
  warn_days: number;
}

const ToDoForm: React.FC<ToDoFormProps> = ({ open, setOpen }) => {
  const profile = useAppSelector(selectProfile);
  const [createTask, { isLoading }] = useCreateTaskMutation();

  const form = useForm<ToDoFormValues>({
    defaultValues: {
      name: '',
      important: false,
      start_at: new Date(),
      recurrence: TaskRecurrence.Single,
      cycle_unit: null,
      cycle_interval: null,
      list_type: null,
      subtasks: [],
      warn_days: 0,
    },
    mode: 'onChange',
  });

  const {
    control,
    getValues,
    setValue,
    watch,
    formState: { isValid, isDirty },
  } = form;

  useEffect(() => {
    const watchSub = watch((data, { name }) => {
      switch (name) {
        case 'recurrence':
          if (data.recurrence === TaskRecurrence.Single) {
            // Clear cycle values if set to recurrence single
            setValue('cycle_unit', null);
            setValue('cycle_interval', null);
          } else {
            if (data.cycle_unit === null) {
              // Set starting cycle values if recurrence is set, but void of cycle values
              setValue('cycle_unit', TaskCycleUnit.Day);
              setValue('cycle_interval', 2);
            }
          }
          break;
      }
    });

    return () => {
      watchSub.unsubscribe();
    };
  }, [watch, setValue]);

  async function submit() {
    const data = getValues();
    const payload = {
      ...data,
      profile_id: profile.id,
    };
    try {
      await createTask(payload);
      setOpen(false);
    } catch (error) {
      // TODO: handle errors
    }
  }

  return (
    <IonModal isOpen={open}>
      <ModalHeader title="Create to-do" onClose={() => setOpen(false)} />
      <IonContent>
        <FormProvider {...form}>
          <FormInput
            name="name"
            control={control}
            placeholder="Task name"
            rules={{ required: rules.required() }}
          />
          <ToDoFormImportanceInput />
          <ToDoFormScheduleInput />
          <ToDoFormSubtaskInput />
          <FormIncrementor
            control={control}
            name="warn_days"
            min={0}
            prefix="that I want to be *reminded of "
            unitName=" day(s) before"
            zeroValueText="that I need *no reminder* for"
          />
        </FormProvider>
      </IonContent>
      <IonFooter>
        <div className="footer-row">
          <IonButton
            disabled={!isValid || !isDirty || isLoading}
            expand="block"
            onClick={submit}
          >
            Create task
          </IonButton>
        </div>
      </IonFooter>
    </IonModal>
  );
};

export default ToDoForm;
