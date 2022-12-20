import { Controller } from 'react-hook-form';
import './FormInput.scss';

interface FormInputProps {
  name: string;
  control: any;
  placeholder?: string;
  type?: 'text' | 'number';
  min?: number;
  max?: number;
  rules?: any;
  disabled?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  name,
  control,
  placeholder,
  type = 'text',
  min,
  max,
  rules,
  disabled = false,
}) => {
  const targetId = `${name}-input`;
  return (
    <div className="form-input_container">
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field }) => {
          return (
            <input
              id={targetId}
              className="form-input"
              {...field}
              placeholder={placeholder}
              type={type}
              min={min}
              max={max}
              disabled={disabled}
            />
          );
        }}
      />
    </div>
  );
};

export default FormInput;
