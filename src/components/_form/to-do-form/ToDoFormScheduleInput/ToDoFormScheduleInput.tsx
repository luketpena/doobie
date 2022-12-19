import { IonContent, IonModal } from '@ionic/react';
import { useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  taskCycleUnitOptions,
  taskRecurrenceOptions,
} from '../../../../util/options';
import { TaskCycleUnit, TaskRecurrence } from '../../../../util/types/enums';
import ModalHeader from '../../../ModalHeader/ModalHeader';
import { ToDoFormValues } from '../../../ToDoForm/ToDoForm';
import FormDatePicker from '../../FormDatePicker/FormDatePicker';
import FormIncrementor from '../../FormIncrementor/FormIncrementor';
import FormItem from '../../FormItem/FormItem';
import FormItemSelector, {
  valueToItemText,
} from '../../FormItemSelector/FormItemSelector';
import { format } from 'date-fns';
import './ToDoFormScheduleInput.scss';

const ToDoFormScheduleInput: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [recurrence, setRecurrence] = useState<TaskRecurrence>();
  const [cycleUnit, setCycleUnit] = useState<TaskCycleUnit | null>(null);
  const [cycleInterval, setCycleInterval] = useState<number | null>(null);

  const form = useFormContext<ToDoFormValues>();
  const { control, watch, resetField, getValues } = form;

  const scheduleText: string = useMemo(() => {
    const dateText = `starting *${format(
      date || new Date(),
      'EEEE, MMMM do, yyyy',
    )}*`;

    const recurrenceText = valueToItemText(
      recurrence as string,
      taskRecurrenceOptions,
    );
    if (recurrence !== TaskRecurrence.Cycle) {
      return `${dateText} ${recurrenceText}`;
    }

    const cycleUnitText = valueToItemText(
      cycleUnit as string,
      taskCycleUnitOptions,
    );

    return `${dateText} ${recurrenceText} every ${cycleInterval} ${cycleUnitText}`;
  }, [recurrence, cycleUnit, cycleInterval, date]);

  useEffect(() => {
    // Initial value
    const values = getValues();
    setRecurrence(values.recurrence);
    setCycleUnit(values.cycle_unit);
    setCycleInterval(values.cycle_interval);
    setDate(new Date(values.start_at));
  }, [getValues]);

  useEffect(() => {
    const watchSub = watch((value, { name }) => {
      switch (name) {
        case 'recurrence':
          const valueIsCycle = value.recurrence === TaskRecurrence.Cycle;
          setRecurrence(value.recurrence);
          if (!valueIsCycle) {
            resetField('cycle_unit');
            resetField('cycle_interval');
          }
          break;
        case 'cycle_unit':
          setCycleUnit(value.cycle_unit ?? null);
          break;
        case 'cycle_interval':
          setCycleInterval(value.cycle_interval ?? null);
          break;
        case 'start_at':
          setDate(value.start_at);
          break;
      }
    });

    return () => {
      watchSub.unsubscribe();
    };
  }, [watch, resetField]);

  return (
    <>
      <FormItem text={scheduleText} onClick={() => setOpen(true)} />
      <IonModal isOpen={open}>
        <ModalHeader title="Schedule task" onClose={() => setOpen(false)} />
        <IonContent>
          <FormDatePicker
            control={control}
            name="start_at"
            prefixText="The task will start on"
          />
          {/* <ScheduleFormStartDateInput /> */}
          <FormItemSelector
            options={taskRecurrenceOptions}
            control={control}
            name="recurrence"
          />
          {recurrence === TaskRecurrence.Cycle && (
            <FormIncrementor
              control={control}
              name="cycle_interval"
              min={2}
              unitOptions={taskCycleUnitOptions}
              unitName="cycle_unit"
            />
          )}
        </IonContent>
      </IonModal>
    </>
  );
};

export default ToDoFormScheduleInput;
