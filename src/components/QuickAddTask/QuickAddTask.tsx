import { IonButton, IonIcon } from '@ionic/react';
import { addCircle } from 'ionicons/icons';
import { useEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { selectProfile } from '../../redux/authentication-slice';
import { useAppSelector } from '../../redux/store';
import { useQuickCreateTaskMutation } from '../../services/task.service';
import { rules } from '../../util/rules';
import FormInput from '../_form/FormInput/FormInput';
import { endOfDay, isPast as isPastFn } from 'date-fns';
import { motion } from 'framer-motion';
import './QuickAddTask.scss';

interface QuickAddTaskProps {
  date: string;
}

const QuickAddTask: React.FC<QuickAddTaskProps> = ({ date }) => {
  const profile = useAppSelector(selectProfile);
  const [quickCreateTask, { isLoading, isSuccess }] =
    useQuickCreateTaskMutation();
  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm({
    defaultValues: {
      name: '',
    },
    mode: 'onChange',
  });
  const {
    control,
    getValues,
    reset,
    formState: { isValid },
  } = form;

  useEffect(() => {
    if (!isLoading && isSuccess) {
      reset();
      inputRef.current?.focus();
    }
  }, [isLoading, isSuccess, reset]);

  const isPast = useMemo(() => {
    const dateToCheck = endOfDay(new Date(date));
    return isPastFn(dateToCheck);
  }, [date]);

  async function submit(event: any) {
    event.preventDefault();
    if (isValid) {
      const name = getValues().name;
      await quickCreateTask({ name, profile_id: profile.id, date });
    }
  }

  return (
    <>
      <motion.form
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="flex items-center quick-add-task_container "
        onSubmit={submit}
      >
        <FormInput
          control={control}
          name="name"
          placeholder="Task name"
          disabled={isLoading || isPast}
          ref={inputRef}
          rules={{
            required: rules.required('Task name is required'),
          }}
        />
        <IonButton
          disabled={isLoading || !isValid || isPast}
          onClick={submit}
          className="h-[48px] m-0"
        >
          <IonIcon icon={addCircle} />
        </IonButton>
      </motion.form>
    </>
  );
};

export default QuickAddTask;
