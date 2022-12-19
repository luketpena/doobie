import { IonButton, IonIcon } from '@ionic/react';
import { add, remove } from 'ionicons/icons';
import { Controller } from 'react-hook-form';
import { FormItemSelectorOption } from '../../../util/options';
import FormItem from '../FormItem/FormItem';
import FormItemSelector from '../FormItemSelector/FormItemSelector';
import './FormIncrementor.scss';

interface FormIncrementorProps {
  control: any;
  name: string;
  min?: number;
  max?: number;
  unitOptions?: FormItemSelectorOption[];
  unitName?: string;
  prefix?: string;
  zeroValueText?: string;
}

const FormIncrementor: React.FC<FormIncrementorProps> = ({
  control,
  name,
  min,
  max,
  unitOptions,
  unitName,
  prefix,
  zeroValueText,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <div className="form-incrementor_container">
          <IonButton
            className="form-incrementor_button"
            onClick={() => {
              if (min !== undefined) {
                onChange(Math.max(value - 1, min));
              } else {
                onChange(value - 1);
              }
            }}
            disabled={min !== undefined ? value <= min : false}
          >
            <IonIcon icon={remove}></IonIcon>
          </IonButton>
          {unitOptions && unitName ? (
            <FormItemSelector
              options={unitOptions}
              name={unitName}
              control={control}
              prefixText={`every *${value}`}
            />
          ) : (
            <FormItem
              text={
                value === 0 && zeroValueText
                  ? zeroValueText
                  : `${prefix ?? ''}${value}${unitName ?? ''}`
              }
            />
          )}
          <IonButton
            className="form-incrementor_button"
            onClick={() => {
              if (max !== undefined) {
                onChange(Math.min(value - 1, max));
              } else {
                onChange(value + 1);
              }
            }}
            disabled={max !== undefined ? value >= max : false}
          >
            <IonIcon icon={add}></IonIcon>
          </IonButton>
        </div>
      )}
    />
  );
};

export default FormIncrementor;
