import { IonButton, IonIcon } from '@ionic/react';
import { addCircle } from 'ionicons/icons';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { selectProfile } from '../../redux/authentication-slice';
import { useAppSelector } from '../../redux/store';
import { useQuickCreateTaskMutation } from '../../services/task.service';
import FormInput from '../_form/FormInput/FormInput';
import './QuickAddTask.scss';

const QuickAddTask: React.FC = () => {
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

  async function submit() {
    const name = getValues().name;
    await quickCreateTask({ name, profile_id: profile.id });
  }

  return (
    <div className="quick-add-task_container">
      <FormInput
        control={control}
        name="name"
        placeholder="Task name"
        disabled={isLoading}
      />
      <IonButton disabled={isLoading} onClick={submit}>
        <IonIcon icon={addCircle} />
      </IonButton>
    </div>
  );
};

export default QuickAddTask;
