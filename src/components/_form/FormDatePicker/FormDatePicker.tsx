import { IonDatetime } from '@ionic/react';
import { format } from 'date-fns';
import { Controller } from 'react-hook-form';
import FormItem from '../FormItem/FormItem';
import './FormDatePicker.scss';

interface FormDatePickerProps {
  control: any;
  name: string;
  prefixText: string;
}

const FormDatePicker: React.FC<FormDatePickerProps> = ({
  control,
  name,
  prefixText,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <div>
          <FormItem
            text={`${prefixText} *${format(
              new Date(value),
              'EEEE, MMMM do, yyyy',
            )}`}
          />
          <div className="form-date-picker_container">
            <IonDatetime
              presentation="date"
              onIonChange={(v: any) => {
                onChange(new Date(v.detail.value));
              }}
              value={new Date(value).toISOString()}
            />
          </div>
        </div>
      )}
    />
  );
};

export default FormDatePicker;
