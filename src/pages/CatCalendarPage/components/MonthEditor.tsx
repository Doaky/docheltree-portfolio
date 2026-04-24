import type { MonthData } from '../types';
import { DAYS_IN_MONTH } from '../constants';
import MonthHeader from './MonthHeader';
import BirthdayPanel from './BirthdayPanel';
import EventPanel from './EventPanel';
import CatCustomizer from './CatCustomizer';
import styles from './MonthEditor.module.scss';

interface Props {
  monthData: MonthData;
  tempUnit: 'F' | 'C';
  onUpdate: (partial: Partial<MonthData>) => void;
}

export default function MonthEditor({ monthData, tempUnit, onUpdate }: Props) {
  const { monthIndex, weather, cat, birthdays, events } = monthData;
  const days = DAYS_IN_MONTH[monthIndex];

  return (
    <div className={styles['month-editor']}>
      <div className={styles['month-editor__card']}>
        <MonthHeader monthIndex={monthIndex} weather={weather} tempUnit={tempUnit} />

        <div className={styles['month-editor__t-table']}>
          <BirthdayPanel
            birthdays={birthdays}
            daysInMonth={days}
            onChange={b => onUpdate({ birthdays: b })}
          />
          <div className={styles['month-editor__t-divider']} />
          <EventPanel
            events={events}
            daysInMonth={days}
            onChange={e => onUpdate({ events: e })}
          />
        </div>

        <CatCustomizer
          cat={cat}
          onChange={c => onUpdate({ cat: c })}
        />
      </div>
    </div>
  );
}
