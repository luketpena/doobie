import { useIonActionSheet } from '@ionic/react';
import { useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { FormItemSelectorOption } from '../../../util/options';
import FormItem from '../FormItem/FormItem';

interface FormItemSelectorProps {
  options: FormItemSelectorOption[];
  header?: string;
  subHeader?: string;
  control: any;
  name: string;
  prefixText?: string;
}

export function valueToItemText(
  value: string,
  options: FormItemSelectorOption[],
) {
  const selectedOption = options.find((option) => option.value === value);
  return selectedOption?.selectionText || '';
}

const FormItemSelector: React.FC<FormItemSelectorProps> = ({
  options,
  header,
  subHeader,
  control,
  name,
  prefixText,
}) => {
  const [present] = useIonActionSheet();

  const buttons: any = useMemo(() => {
    return options.map((option) => {
      return {
        text: option.label,
        data: option.value,
      };
    });
  }, [options]);

  function openOptionsList(onChange: (v: any) => void) {
    present({
      header: header,
      subHeader: subHeader,
      buttons,
      onDidDismiss: ({ detail }) => {
        if (detail.data) {
          onChange(detail.data);
        }
      },
    });
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <FormItem
          text={
            prefixText
              ? `${prefixText} ${valueToItemText(value, options)}`
              : valueToItemText(value, options)
          }
          onClick={() => openOptionsList(onChange)}
        />
      )}
    />
  );
};

export default FormItemSelector;
