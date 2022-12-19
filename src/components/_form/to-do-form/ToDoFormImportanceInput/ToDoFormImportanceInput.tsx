import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { ToDoFormValues } from '../../../ToDoForm/ToDoForm';
import FormToggle from '../../FormToggle/FormToggle';

const ToDoFormImportanceInput: React.FC = () => {
  const { setValue, watch, control } = useFormContext<ToDoFormValues>();
  const [importantValue, setImportantValue] = useState<boolean | null>(null);

  useEffect(() => {
    const watchSub = watch((values, { value, name }) => {
      if (name === 'important') {
        setImportantValue(values.important as boolean);
      }
    });

    return () => {
      watchSub.unsubscribe();
    };
  }, [watch]);

  function onClick() {
    setValue('important', !importantValue);
  }

  return (
    <FormToggle
      control={control}
      name="important"
      trueText="is an *important* thing I need to do"
      falseText="is a *regular* thing I need to do"
    />
  );
};

export default ToDoFormImportanceInput;
