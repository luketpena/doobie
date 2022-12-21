import { IonButton, IonIcon, IonProgressBar } from '@ionic/react';
import {
  differenceInDays,
  format,
  getDate,
  getDaysInMonth,
  startOfDay,
} from 'date-fns';
import {
  chevronBackCircleOutline,
  chevronForwardCircleOutline,
} from 'ionicons/icons';
import { useMemo } from 'react';
import { isToday as isTodayFn } from 'date-fns';
import './DateNavigator.scss';

interface DateNavigatorProps {
  date: string;
  incrementDate: (v: number) => void;
  setDate: (v: string) => void;
}

const DateNavigator: React.FC<DateNavigatorProps> = ({
  date,
  incrementDate,
  setDate,
}) => {
  const isToday: boolean = useMemo(() => {
    return isTodayFn(new Date(date));
  }, [date]);

  const progress: number = useMemo(() => {
    const day = new Date(date);
    const daysInMonth = getDaysInMonth(day);
    const currentDay = getDate(day);

    return currentDay / daysInMonth;
  }, [date]);

  const daysOffset: number = useMemo(() => {
    return differenceInDays(startOfDay(new Date(date)), startOfDay(new Date()));
  }, [date]);

  return (
    <div className="flex flex-col gap-4px;">
      <div className="date-navigator-container">
        <IonButton onClick={() => incrementDate(-1)}>
          <IonIcon icon={chevronBackCircleOutline} />
        </IonButton>
        <div
          className="flex flex-col justify-center items-center"
          onClick={() => setDate(new Date().toISOString())}
        >
          <div className="font-bold text-xl flex items-center gap-2">
            <span>{isToday ? 'Today' : format(new Date(date), 'EEEE')}</span>
            {daysOffset !== 0 && (
              <span className="font-light text-sm opacity-50">
                (
                {daysOffset > 0
                  ? `in ${daysOffset} ${daysOffset === 1 ? 'day' : 'days'}`
                  : `${Math.abs(daysOffset)} ${
                      daysOffset === -1 ? 'day' : 'days'
                    } ago`}
                )
              </span>
            )}
          </div>
          <div className="opacity-75">
            {format(new Date(date), 'MMMM do, yyyy')}
          </div>
        </div>
        <IonButton onClick={() => incrementDate(1)}>
          <IonIcon icon={chevronForwardCircleOutline} />
        </IonButton>
      </div>
      <IonProgressBar value={progress} />
    </div>
  );
};

export default DateNavigator;
