import classNames from 'classnames';
import { Controller } from 'react-hook-form';
import FormItem from '../FormItem/FormItem';
import './FormToggle.scss';

interface FormToggleProps {
  trueText: string;
  falseText: string;
  control: any;
  name: string;
}

const FormToggle: React.FC<FormToggleProps> = ({
  trueText,
  falseText,
  control,
  name,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <div className={classNames('form-toggle_container', { active: value })}>
          <div className={classNames('form-toggle_switch')}>
            <FormItem
              text={value ? trueText : falseText}
              onClick={() => onChange(!value)}
              color={value ? 'success' : 'secondary'}
            />
          </div>
        </div>
      )}
    />
  );
};

export default FormToggle;
