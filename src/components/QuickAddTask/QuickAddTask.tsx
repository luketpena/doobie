import { IonButton, IonIcon } from '@ionic/react';
import { addCircle } from 'ionicons/icons';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { selectProfile } from '../../redux/authentication-slice';
import { useAppSelector } from '../../redux/store';
import { useQuickCreateTaskMutation } from '../../services/task.service';
import FormInput from '../_form/FormInput/FormInput';
import './QuickAddTask.scss';

interface QuickAddTaskProps {
  date: string;
}

const QuickAddTask: React.FC<QuickAddTaskProps> = ({ date }) => {
  const profile = useAppSelector(selectProfile);
  const [quickCreateTask, { isLoading, isSuccess }] =
    useQuickCreateTaskMutation();
  const form = useForm({
    defaultValues: {
      name: '',
    },
  });
  const { control, getValues, reset } = form;

  useEffect(() => {
    if (!isLoading && isSuccess) {
      reset();
    }
  }, [isLoading, isSuccess, reset]);

  async function submit(event: any) {
    event.preventDefault();
    const name = getValues().name;
    await quickCreateTask({ name, profile_id: profile.id, date });
  }

  return (
    <form
      className="flex items-center quick-add-task_container "
      onSubmit={submit}
    >
      <FormInput
        control={control}
        name="name"
        placeholder="Task name"
        disabled={isLoading}
      />
      <IonButton disabled={isLoading} onClick={submit} className="h-[48px] m-0">
        <IonIcon icon={addCircle} />
      </IonButton>
    </form>
  );
};

export default QuickAddTask;
