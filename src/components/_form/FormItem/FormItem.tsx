import { PropsWithChildren, useMemo } from 'react';
import classNames from 'classnames';
import './FormItem.scss';
import { Color } from '../../../util/types/style-types';

interface FormItemProps extends PropsWithChildren {
  text: string;
  onClick?: () => void;
  clickable?: boolean;
  color?: Color;
}

interface FormItemTextConfig {
  text: string;
  important: boolean;
}

const FormItem: React.FC<FormItemProps> = ({
  text,
  onClick,
  clickable = true,
  color = 'primary',
}) => {
  const textElement = useMemo(() => {
    // Set initial importance based on first character
    let importantActive = false;

    const textArrays: FormItemTextConfig[] = [];
    let textArrayIndex = 0;

    for (let i = 0; i < text.length; i++) {
      const char = text.charAt(i);
      if (char === '*') {
        importantActive = !importantActive;
        if (i > 0) {
          textArrayIndex++;
        }
      } else {
        if (textArrays[textArrayIndex] === undefined) {
          textArrays.push({
            text: char,
            important: importantActive,
          });
        } else {
          textArrays[textArrayIndex].text += char;
        }
      }
    }

    return textArrays.map(({ text, important }, i) => (
      <span
        key={`form-item-${important ? 'important' : 'regular'}-${i}`}
        className={classNames({ 'form-item_text-emphasis': important }, color)}
      >
        {text}
      </span>
    ));
  }, [text]);

  return (
    <div
      className={classNames('form-item_container', {
        'form-item_clickable': clickable,
      })}
      onClick={() => {
        if (clickable && onClick) {
          onClick();
        }
      }}
      key={`${text}-${clickable}`}
    >
      {textElement}
    </div>
  );
};

export default FormItem;
